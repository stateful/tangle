import {
    debounce,
    firstValueFrom,
    from,
    isObservable,
    map,
    merge,
    Observable,
    of,
    scan,
    switchMap,
    tap,
    timer,
} from 'rxjs';
import { Provider } from './types';
import { Client, Bus } from './tangle';

export default abstract class BaseChannel<U, T> {
    public providers: U[] = [];
    public abstract register(providers: U[] | Observable<U>[], dispose?: boolean): Observable<Bus<T>>;
    protected _state?: T;

    constructor(
        private _namespace: string,
        private _defaultValue?: Required<T>,
    ) { }

    /**
     * operator to debounce providers when either the count or timeout is reached first
     */
    protected debounceResolution(count: number, timeout: number) {
        return (source: Observable<Provider[]>) => source.pipe(debounce(ps => {
            const t = ps.length === count ? 0 : timeout;
            return timer(t);
        }));
    }

    public registerPromise(providers: U[] | Promise<U>[]): Promise<Bus<T>> {
        const observableProviders: Observable<U>[] = providers.map((p) => {
            return typeof (p as any).then === 'function' ? from(p as Promise<U>) : of(p as U);
        });

        return firstValueFrom(this.register(observableProviders, false));
    }

    protected _register(providers: U[] | Observable<U>[], providerMapper: { (p: U): Provider; }, dispose: boolean): Observable<Bus<T>> {
        const observableProviders: Observable<U>[] = providers.map((p) => isObservable(p) ? (p as Observable<U>) : of(p as U));
        const providers$ = merge(...observableProviders).pipe(
            tap(p => this.providers.push(p)),
            map(p => providerMapper(p)),
            scan((acc, one) => {
                acc.push(one);
                return acc;
            }, <Provider[]>[])
        );

        return providers$.pipe(
            this.debounceResolution(this.providers.length, 100),
            switchMap(providers => {
                return new Observable<Bus<T>>(observer => {
                    const bus = this._initiateBus(providers, this._state);
                    const s = bus.transient.subscribe(transient => this._state = transient);
                    observer.next(bus);
                    return () => {
                        if (dispose === false) { return; }
                        bus.dispose();
                        s.unsubscribe();
                    };
                });
            }),
        );
    }

    protected _initiateBus(providers: Provider[], previousState?: T) {
        return new Bus<T>(this._namespace, providers, previousState || this._defaultValue || {} as T);
    }

    protected _initiateClient(provider: Provider) {
        const client = new Client<T>(this._namespace, [provider], this._defaultValue || {} as T);
        client.notify();
        return client;
    }
}
