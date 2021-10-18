import * as vscode from "vscode";
import {
  BehaviorSubject,
  bufferCount,
  filter,
  from,
  map,
  merge,
  mergeMap,
  Observable,
  pluck,
  scan,
  share,
  Subject,
  withLatestFrom,
} from "rxjs";

export interface VrxProvider {
  webview: Observable<vscode.Webview>;
  identifier: string;
}

export class Vrx<T> {
  private readonly _outbound: Subject<T>;
  private readonly _inbound: BehaviorSubject<T>;
  private readonly _events: Subject<T>;
  private readonly _transient: Observable<T>;

  constructor(
    public readonly namespace: string,
    providers: VrxProvider[],
    public readonly defaultValue: T
  ) {
    this._outbound = new Subject<T>();
    this._inbound = new BehaviorSubject<T>(this.defaultValue);
    this._events = new Subject<T>();

    this._transient = this.register(providers);
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

  public on(eventName: string, fn: (...args: any[]) => void) {
    this.events
      .pipe(
        mergeMap((events) => from(Object.entries(events))),
        filter(([k]) => k.toLowerCase().indexOf(eventName.toLowerCase()) >= 0),
        map(([_, v]) => v)
      )
      .subscribe(fn);
  }

  public onAll(fn: (...args: any[]) => void) {
    this.events.subscribe(fn);
  }

  private fold(acc: T, one: T) {
    return { ...acc, ...one };
  }

  private fromEntries(accum: T, [k, v]: [string, any]) {
    const r: any = { ...accum };
    r[k] = v;
    return r as T;
  }

  private grouped() {
    return (source: Observable<T>) => {
      return source.pipe(
        map((payload) => {
          const entries = Object.entries(payload);
          const grouped: { transient?: T; event?: T }[] = entries.map((entry) => {
            const isPrefixed = entry[0].indexOf("on") === 0;
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

  private fromWebviews() {
    return (source: Observable<vscode.Webview>) => {
      return source.pipe(
        map((webview) => {
          webview.onDidReceiveMessage((payload: any) => {
            const unpacked = payload[this.namespace];
            if (unpacked) {
              this._inbound.next(unpacked as T);
            }
          });
          return webview;
        })
      );
    };
  }

  private register(providers: VrxProvider[]): Observable<T> {
    const webviews = providers.map((panel) => panel.webview);
    const inGrouped$ = this._inbound.pipe(this.grouped());
    const outGrouped$ = this._outbound.pipe(this.grouped());

    const transientGrouped$ = merge(
      inGrouped$.pipe(pluck("transient")),
      outGrouped$.pipe(pluck("transient"))
    );

    const inEvent$ = inGrouped$.pipe(pluck("event"));
    inEvent$.subscribe((event) => {
      this._events.next(event);
    });

    const transient$ = merge(...webviews).pipe(
      this.fromWebviews(),
      mergeMap((webview) => {
        return transientGrouped$.pipe(
          scan(this.fold, this.defaultValue),
          mergeMap((transient) => {
            const namespaced: any = {};
            namespaced[this.namespace] = transient;
            return from(webview.postMessage(namespaced).then(() => transient));
          })
        );
      }),
      bufferCount(webviews.length),
      map((transient) => {
        return transient.reduce(this.fold, this.defaultValue);
      }),
      share()
    );

    const outEvent$ = outGrouped$.pipe(pluck("event"));

    merge(...webviews)
      .pipe(
        mergeMap((webview) => {
          return outEvent$.pipe(
            withLatestFrom(transient$),
            mergeMap(([event, transient]) => {
              const namespaced: any = {};
              namespaced[this.namespace] = { ...transient, ...event };
              return from(webview.postMessage(namespaced).then(() => event));
            })
          );
        })
      )
      .subscribe();

    transient$.subscribe();

    return transient$;
  }
}
