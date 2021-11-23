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
    throttleTime,
    first,
    Subscription,
} from 'rxjs';
import type { Provider } from './types';

type Payload<T> = { transient: T, event?: Record<string, any> };

export class Client<T> {
    protected readonly _outbound: Subject<Payload<T>>;
    protected readonly _inbound: BehaviorSubject<Payload<T>>;
    protected readonly _events: Subject<Payload<T>>;

    protected readonly _transient: Observable<T>;

    constructor(
        public readonly namespace: string,
        public readonly defaultValue: T,
        public readonly providers: Provider[],
        private readonly _isBus: boolean = false
    ) {
        this._outbound = new Subject<Payload<T>>();
        this._inbound = new BehaviorSubject<Payload<T>>({ transient: this.defaultValue });
        this._events = new Subject<Payload<T>>();

        this._transient = this.register();
    }

    public get events() {
        return this._events.asObservable().pipe(share());
    }

    public get transient() {
        return this._transient;
    }

    /**
     * share state with other sandboxes
     * @param state to share with other sandboxes
     */
    public broadcast(state: T) {
        this._outbound.next({ transient: state });
    }

    /**
     * broadcast events with other sandboxes
     * @param eventName name of the event
     * @param payload   event payload
     */
    public emit (eventName: string, payload: any) {
        this._outbound.next({ event: { [eventName]: payload } } as any);
    }

    /**
     * event handler to act on changes to certain state properties
     * @param key state property
     * @param fn  handler to call once state of given property changes
     */
    public listen(key: keyof T, fn: (...args: any[]) => void) {
        if (this._isBus) {
            fn(this.defaultValue[key]);
        }

        this.events
            .pipe(
                pluck('transient'),
                pluck(key),
                filter((val) => val !== undefined)
            )
            .subscribe(fn);
    }

    /**
     * listen to events shared within given namespace
     * @param eventName name of the event
     * @param fn        event handler
     */
    public on(eventName: string, fn: (...args: any[]) => void) {
        return this.events
            .pipe(
                pluck('event'),
                filter(Boolean),
                mergeMap((events) => from(Object.entries(events))),
                filter(([k]) => k.toLowerCase().indexOf(eventName.toLowerCase()) >= 0),
                map(([, v]) => v)
            )
            .subscribe(fn);
    }

    /**
     * listen to a certain event shared within given namespace once
     * @param eventName name of the event
     * @param fn        event handler
     */
    public once(eventName: string, fn: (...args: any[]) => void) {
        return this.events
            .pipe(
                pluck('event'),
                filter(Boolean),
                mergeMap((events) => from(Object.entries(events))),
                filter(([k]) => k.toLowerCase().indexOf(eventName.toLowerCase()) >= 0),
                map(([, v]) => v),
                first()
            )
            .subscribe(fn);
    }

    /**
     * listen to a certain event shared within given namespace once
     * @param subscription observable of event that should be unsubscribed
     */
     public off(subscription: Subscription) {
        subscription.unsubscribe();
    }

    protected register(): Observable<T> {
        const providers = from(this.providers);
        const inGrouped$ = this._inbound;
        const outGrouped$ = this._outbound;

        const transientGrouped$ = merge(
            inGrouped$.pipe(pluck('transient')),
            outGrouped$.pipe(pluck('transient'))
        );
        const transient$ = merge(providers).pipe(
            this.fromProviders(),
            mergeMap(() => {
                return transientGrouped$.pipe(
                    scan(this.fold, this.defaultValue),
                    throttleTime(20),
                    mergeMap((transient) => {
                        const namespaced: Record<string, any> = {};
                        namespaced[this.namespace] = transient;
                        return of(transient);
                    })
                );
            }),
            bufferCount(this.providers.length),
            map((transients) => {
                return transients.reduce(this.fold, this.defaultValue);
            }),
            share()
        );

        if (!this._isBus) {
            inGrouped$.subscribe((state) => {
                if (state) {
                    this._events.next(state);
                }
            });
        }
        const event$ = this._isBus ? merge(outGrouped$, inGrouped$) : outGrouped$;
        event$
            .pipe(
                withLatestFrom(transient$),
                map(([event, transient]) => {
                    if (event.event) {
                        return { event: event.event };
                    }

                    if (event.transient) {
                        return { transient: { ...transient, ...event.transient } };
                    }

                    throw new Error(`Neither event nor state change was given`);
                }),
                map((combo) => {
                    if (this._isBus) {
                        this._events.next({
                            event: combo.event,
                            transient: combo.transient || {} as T
                        });
                    }

                    this.providers.forEach((provider) => {
                        provider.postMessage({ [this.namespace]: combo });
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
                    provider.onMessage((payload) => {
                        const unpacked = (payload as any as Record<string, Payload<T>>)[this.namespace];
                        if (unpacked) {
                            this._inbound.next(unpacked);
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

    protected fold(acc?: T, one?: T): T {
        if (!acc || !one) {
            return acc || one as T;
        }

        return { ...acc, ...one };
    }

    protected fromEntries(accum: T, [k, v]: [string, any]) {
        const r: any = { ...accum };
        r[k] = v;
        return r as T;
    }
}

export class Bus<T> extends Client<T> {
    constructor(namespace: string, defaultValue: T, providers: Provider[]) {
        super(namespace, defaultValue, providers, true);
    }
}

export * from './types';
