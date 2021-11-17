import {
  BehaviorSubject,
  from,
  merge,
  Observable,
  of,
  Subject,
  bufferCount,
  filter,
  map,
  mergeMap,
  pairwise,
  pluck,
  scan,
  share,
  startWith,
  withLatestFrom,
  distinctUntilKeyChanged,
  throttleTime,
} from 'rxjs';
import type { Provider } from './types';

export class Client<T> {
  protected readonly _outbound: Subject<T>;
  protected readonly _inbound: BehaviorSubject<T>;
  protected readonly _events: Subject<T>;

  protected readonly _transient: Observable<T>;

  constructor(
    public readonly namespace: string,
    public readonly defaultValue: T,
    public readonly providers: Provider[],
    private readonly _isBus: boolean = false
  ) {
    this._outbound = new Subject<T>();
    this._inbound = new BehaviorSubject<T>(this.defaultValue);
    this._events = new Subject<T>();

    this._transient = this.register();
  }

  public get events() {
    return this._events.asObservable().pipe(share());
  }

  public get transient() {
    return this._transient;
  }

  public broadcast(transient: T) {
    this._outbound.next(transient);
  }

  public listen(key: keyof T, fn: (...args: any[]) => void) {
    this.events
      .pipe(
        pluck(key),
        filter((val) => val !== undefined)
      )
      .subscribe(fn);
  }

  public on(eventName: string, fn: (...args: any[]) => void) {
    this.events
      .pipe(
        mergeMap((events) => from(Object.entries(events))),
        filter(([k]) => k.toLowerCase().indexOf(eventName.toLowerCase()) >= 0),
        map(([, v]) => v)
      )
      .subscribe(fn);
  }

  public onAll(fn: (...args: any[]) => void) {
    this.events.subscribe(fn);
  }

  public subscribe(
    key: keyof T,
    fn: (...args: any[]) => void,
    distinctUntilChanged = false
  ) {
    if (distinctUntilChanged) {
      return this.transient
        .pipe(
          distinctUntilKeyChanged(key),
          pluck(key),
          filter((val) => val !== undefined)
        )
        .subscribe(fn);
    } else {
      return this.transient
        .pipe(
          pluck(key),
          filter((val) => val !== undefined)
        )
        .subscribe(fn);
    }
  }

  protected register(): Observable<T> {
    const providers = from(this.providers);
    const inGrouped$ = this._inbound.pipe(this.grouped());
    const outGrouped$ = this._outbound.pipe(this.grouped());

    const transientGrouped$ = merge(
      inGrouped$.pipe(pluck('transient')),
      outGrouped$.pipe(pluck('transient'))
    );

    const inEvent$ = inGrouped$.pipe(pluck('event'));
    inEvent$.subscribe((event) => {
      this._events.next(event);
    });

    const transient$ = merge(providers).pipe(
      this.fromProviders(),
      mergeMap((provider) => {
        return transientGrouped$.pipe(
          scan(this.fold, this.defaultValue),
          throttleTime(20),
          mergeMap((transient) => {
            const namespaced: Record<string, any> = {};
            namespaced[this.namespace] = transient;
            if (this._isBus) {
              return from(provider.postMessage(namespaced).then(() => transient));
            } else {
              return of(transient);
            }
          })
        );
      }),
      bufferCount(this.providers.length),
      map((transients) => {
        return transients.reduce(this.fold, this.defaultValue);
      }),
      share()
    );

    const outEvent$ = outGrouped$.pipe(pluck('event'));
    const event$ = this._isBus ? merge(outEvent$, inEvent$) : outEvent$;

    event$
      .pipe(
        withLatestFrom(transient$),
        map(([event, transient]) => {
          return { ...transient, ...event };
        }),
        map((combo) => {
          const namespaced: any = {};
          namespaced[this.namespace] = combo;

          this.providers.forEach((provider) => {
            provider.postMessage(namespaced);
          });
        })
      )
      .subscribe();

    transient$.subscribe();

    return transient$;
  }

  protected fromProviders() {
    return (source: Observable<Provider>) => {
      return source.pipe(
        map((provider) => {
          provider.onMessage((payload: any) => {
            const unpacked = payload[this.namespace];
            if (unpacked) {
              const payload = unpacked as T;
              this._inbound.next(payload);
            }
          });
          return provider;
        })
      );
    };
  }

  protected dedupe() {
    return (source: Observable<T>) => {
      return source.pipe(
        startWith(this.defaultValue),
        pairwise(),
        filter(([prev, curr]) => JSON.stringify(prev) !== JSON.stringify(curr)),
        map(([, curr]) => curr)
      );
    };
  }

  protected fold(acc: T, one: T) {
    return { ...acc, ...one };
  }

  protected fromEntries(accum: T, [k, v]: [string, any]) {
    const r: any = { ...accum };
    r[k] = v;
    return r as T;
  }

  protected grouped() {
    return (source: Observable<T>) => {
      return source.pipe(
        map((payload) => {
          const entries = Object.entries(payload);
          const grouped: { transient?: T; event?: T }[] = entries.map((entry) => {
            const isPrefixed = entry[0].indexOf('on') === 0;
            const obj = this.fromEntries(this.defaultValue, entry);
            if (isPrefixed) {
              return { event: obj };
            }
            return { transient: obj };
          });
          return grouped;
        }),
        map((grouped) => {
          return {
            transient: grouped.reduce((accum, one) => {
              return { ...accum, ...one.transient };
            }, this.defaultValue),
            event: grouped.reduce((accum, one) => {
              return { ...accum, ...one.event };
            }, this.defaultValue),
          };
        })
      );
    };
  }
}

export class Bus<T> extends Client<T> {
  constructor(namespace: string, defaultValue: T, providers: Provider[]) {
    super(namespace, defaultValue, providers, true);
  }
}

export * from './types';
