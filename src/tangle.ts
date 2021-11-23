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
    pluck,
    scan,
    share,
    withLatestFrom,
    throttleTime,
    first,
    Subscription,
} from 'rxjs';
import type { Provider, EventName, Payload, Listener, RegisteredEvent } from './types';

export class Client<T> {
    private readonly _outbound: Subject<Payload<T>>;
    private readonly _inbound: BehaviorSubject<Payload<T>>;
    private readonly _events: Subject<Payload<T>>;

    private readonly _transient: Observable<T>;
    private readonly _eventMap: Map<EventName, RegisteredEvent[]> = new Map();

    constructor(
        public readonly namespace: string,
        public readonly defaultValue: T,
        public readonly providers: Provider[],
        private readonly _isBus: boolean = false
    ) {
        this._outbound = new Subject<Payload<T>>();
        this._inbound = new BehaviorSubject<Payload<T>>({ transient: this.defaultValue });
        this._events = new Subject<Payload<T>>();

        this._transient = this._register();
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
     * event handler to act on changes to certain state properties
     * @param key state property
     * @param fn  handler to call once state of given property changes
     */
    public listen(eventName: keyof T, fn: Listener) {
        if (this._isBus) {
            fn(this.defaultValue[eventName]);
        }

        return this.events.pipe(
            pluck('transient'),
            pluck(eventName),
            filter((val) => val !== undefined)
        ).subscribe(fn);
    }

    /**
     * broadcast events with other sandboxes
     * @param eventName name of the event
     * @param payload   event payload
     */
    public emit (eventName: EventName, payload: any) {
        this._outbound.next({ event: { [eventName as string]: payload } } as any);
    }

    /**
     * listen to events shared within given namespace
     * @param eventName name of the event
     * @param fn        event handler
     */
    public on(eventName: EventName, fn: Listener) {
        return this._registerEvent(eventName, fn);
    }

    /**
     * listen to a certain event shared within given namespace once
     * @param eventName name of the event
     * @param fn        event handler
     */
    public once(eventName: EventName, fn: Listener) {
        return this._registerEvent(eventName, fn, true);
    }

    /**
     * listen to a certain event shared within given namespace once
     * @param subscription observable of event that should be unsubscribed
     */
    public off(subscription: Subscription) {
        subscription.unsubscribe();
    }

    /**
     * Get a listing the events for which the emitter has listeners.
     * The values in the array are strings or Symbols.
     * @returns `(string | symbol)[]`
     */
    public eventNames () {
        return [...this._eventMap.keys()];
    }

    /**
     * Returns the number of listeners listening to the event named eventName.
     * @param eventName The name of the event being listened for
     * @returns `integer`
     */
    public listenerCount (eventName: EventName) {
        return this.listeners(eventName).length;
    }

    /**
     * Returns a copy of the array of listeners for the event named eventName.
     * @param eventName The name of the event being listened for
     * @returns `Function[]`
     */
    public listeners (eventName: EventName) {
        return (this._eventMap.get(eventName) || ([] as RegisteredEvent[]))
            .map(({ fn }) => fn);
    }

    /**
     * Removes all listeners, or those of the specified eventName.
     */
    public removeAllListeners () {
        const registeredEvents = [...this._eventMap.values()];
        for (const events of registeredEvents) {
            events.forEach(({ obs }) => obs.unsubscribe());
        }
        return this;
    }

    private _registerEvent(eventName: EventName, fn: Listener, isOnce = false) {
        const events = this._eventMap.get(eventName) || ([] as RegisteredEvent[]);
        const index = typeof eventName === 'string'
            ? eventName.toLocaleLowerCase()
            : eventName.toString().toLowerCase();

        const obs = this.events
            .pipe(
                pluck('event'),
                filter(Boolean),
                mergeMap((events) => from(Object.entries(events))),
                filter(([k]) => k.toLowerCase().indexOf(index) >= 0),
                map(([, v]) => v),
                (source) => {
                    if (!isOnce) {
                        return source;
                    }
                    return source.pipe(first());
                }
            )
            .subscribe(fn);

        events.push({ fn, obs });
        this._eventMap.set(eventName, events);
        return obs;
    }

    private _register(): Observable<T> {
        const providers = from(this.providers);
        const inGrouped$ = this._inbound;
        const outGrouped$ = this._outbound;

        const transientGrouped$ = merge(
            inGrouped$.pipe(pluck('transient')),
            outGrouped$.pipe(pluck('transient'))
        );
        const transient$ = merge(providers).pipe(
            this._fromProviders(),
            mergeMap(() => {
                return transientGrouped$.pipe(
                    scan(this._fold, this.defaultValue),
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
                return transients.reduce(this._fold, this.defaultValue);
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

    private _fromProviders() {
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

    private _fold(acc?: T, one?: T): T {
        if (!acc || !one) {
            return acc || one as T;
        }

        return { ...acc, ...one };
    }
}

export class Bus<T> extends Client<T> {
    constructor(namespace: string, defaultValue: T, providers: Provider[]) {
        super(namespace, defaultValue, providers, true);
    }
}

export * from './types';
