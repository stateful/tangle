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
    EMPTY,
    firstValueFrom,
} from 'rxjs';
import type { Provider, Payload, Listener, RegisteredEvent, Context } from './types';

export class Client<T> {
    public readonly id: string = this._isBus ? 'bus' : Math.random().toString(36).substring(2);

    public readonly context: Observable<Context>;

    private readonly _outbound: Subject<Payload<T>>;
    private readonly _inbound: BehaviorSubject<Payload<T>>;
    private readonly _events: Subject<Payload<T>>;
    private readonly _notifer = new Subject<Context>();

    private readonly _transient: Observable<T>;
    private readonly _eventMap: Map<keyof T, RegisteredEvent<T>[]> = new Map();

    private readonly _context: Context = { clients: new Map() };

    constructor(
        public readonly namespace: string,
        public readonly providers: Provider[],
        public readonly defaultValue: T,
        private readonly _isBus: boolean = false
    ) {
        this._outbound = new Subject<Payload<T>>();
        this._inbound = new BehaviorSubject<Payload<T>>({ transient: this.defaultValue, context: this._context });
        this._events = new Subject<Payload<T>>();

        // bus keeps track of connections
        this._context.clients.set(this.id, this._isBus);
        this.context = this._registerContext();

        this._transient = this._register();
    }

    public dispose() {
        this._inbound.complete();
        this.removeAllListeners();
    }

    public get events() {
        return this._events.asObservable().pipe(share());
    }

    public get transient() {
        return this._transient;
    }

    public get state() {
        return this._inbound.value.transient;
    }

    /**
     * notify bus of new sandbox
     */
    public notify() {
        this._context.clients.set(this.id, true);
        this._notifer.next(this._context);
    }

    /**
     * collect and hold information about connected sandboxes
     */
    private _registerContext() : Observable<Context> {
        const context$ = this._inbound.pipe(
            pluck('context'),
            filter(Boolean),
            scan((acc, curr) => {
                if (Array.isArray(curr?.clients)) {
                    // deserialize array into es6 map
                    const _curr: Context = { clients: new Map(curr.clients) };
                    _curr.clients.forEach(((value, key) => acc.clients.set(key, value)));
                }
                return acc;
            }, this._context),
            share()
        );
        context$.subscribe(ctx => {
            this._context.clients = ctx.clients;
        });

        return context$;
    }

    /**
     * returns promise that fires when all sandboxes have connected
     */
    public whenReady(): Promise<Context>{
        return firstValueFrom(this.context.pipe(
            bufferCount(this.providers.length),
            map(() => this._context)
        ));
    }

    /**
     * share state with other sandboxes
     * @param state to share with other sandboxes
     */
    public broadcast(state: T) {
        this._outbound.next({ transient: state, context: this._context });
    }

    /**
     * event handler to act on changes to certain state properties
     * @param eventName state property
     * @param fn  handler to call once state of given property changes
     */
    public listen<K extends keyof T>(eventName: K, fn: Listener<T[K]>) {
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
    public emit<K extends keyof T>(eventName: K, payload: T[K]) {
        this._outbound.next({ event: { [eventName as string]: payload } } as any);
    }

    /**
     * listen to events shared within given namespace
     * @param eventName name of the event
     * @param fn        event handler
     */
    public on<K extends keyof T>(eventName: K, fn: Listener<T[K]>) {
        return this._registerEvent(eventName, fn);
    }

    /**
     * listen to a certain event shared within given namespace once
     * @param eventName name of the event
     * @param fn        event handler
     */
    public once<K extends keyof T>(eventName: K, fn: Listener<T[K]>) {
        return this._registerEvent(eventName, fn, true);
    }

    /**
     * listen to a certain event shared within given namespace once
     * @param subscription observable of event that should be unsubscribed
     */
    public off<K extends keyof T>(eventName: K, listener: Listener<T[K]>) {
        const events = this._eventMap.get(eventName) || ([] as RegisteredEvent<T>[]);
        events
            .filter(({ fn }) => fn === listener)
            .forEach(({ obs }) => obs.unsubscribe());
        return this;
    }

    /**
     * Get a listing the events for which the emitter has listeners.
     * The values in the array are strings or Symbols.
     * @returns `(string | symbol)[]`
     */
    public eventNames() {
        return [...this._eventMap.keys()];
    }

    /**
     * Returns the number of listeners listening to the event named eventName.
     * @param eventName The name of the event being listened for
     * @returns `integer`
     */
    public listenerCount<K extends keyof T>(eventName: K) {
        return this.listeners(eventName).length;
    }

    /**
     * Returns a copy of the array of listeners for the event named eventName.
     * @param eventName The name of the event being listened for
     * @returns `Function[]`
     */
    public listeners<K extends keyof T>(eventName: K) {
        return (this._eventMap.get(eventName) || ([] as RegisteredEvent<T>[]))
            .map(({ fn }) => fn);
    }

    /**
     * Removes all listeners, or those of the specified eventName.
     */
    public removeAllListeners() {
        const registeredEvents = [...this._eventMap.values()];
        for (const events of registeredEvents) {
            events.forEach(({ obs }) => obs.unsubscribe());
        }
        return this;
    }

    private _registerEvent<K extends keyof T>(eventName: K, fn: Listener<T[K]>, isOnce = false) {
        const events = this._eventMap.get(eventName) || ([] as RegisteredEvent<T>[]);
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

        // @ts-expect-error ToDo(Christian): fix TS error here
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
                }),
                map((combo) => {
                    if (combo === undefined) {
                        return EMPTY;
                    }

                    if (this._isBus) {
                        this._events.next({
                            event: combo.event,
                            transient: combo.transient || {} as T,
                            context: this._context
                        });
                    }

                    this.providers.forEach((provider) => {
                        provider.postMessage({ [this.namespace]: combo });
                    });
                })
            )
            .subscribe();

        if (!this._isBus) {
            this._notifer.pipe(map(_context => {
                // es6 map is not json serializable
                const context = { clients: Array.from(_context.clients.entries()) };
                return { context } as any; // special payload
            })).subscribe(payload => {
                this.providers.forEach((provider) => {
                    provider.postMessage({ [this.namespace]: payload });
                });
            });
        }

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
    constructor(namespace: string, providers: Provider[], defaultValue: T) {
        super(namespace, providers, defaultValue, true);
    }
}

export * from './types';
