import {
    from,
    isObservable,
    map,
    merge,
    Observable,
    of,
    scan,
    switchMap,
    tap,
} from 'rxjs';
import { Provider } from './types';
import { Client, Bus, debounceRace } from './tangle';

export default abstract class BaseChannel<U, T> {
    public providers: U[] = [];
    public abstract register(providers: U[] | Observable<U>[]): Observable<Bus<T>>;
    protected _state?: T;

    constructor(
        private _namespace: string,
        private _defaultValue?: Required<T>,
    ) { }

    public registerPromise(providers: U[] | Promise<U>[]): Promise<Bus<T>> {
        const observableProviders: Observable<U>[] = providers.map((p) => {
            return typeof (p as any).then === 'function' ? from(p as Promise<U>) : of(p as U);
        });

        // wrap observable without complete to avoid tear down
        return new Promise((resolve, reject) => this.register(observableProviders).subscribe({ next: resolve, error: reject }));
    }

    protected _register(providers: U[] | Observable<U>[], providerMapper: { (p: U): Provider; }): Observable<Bus<T>> {
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
            debounceRace<Provider[]>(this.providers.length, 100, (subject => subject.length)),
            switchMap(providers => {
                return new Observable<Bus<T>>(observer => {
                    const bus = this._initiateBus(providers, this._state);
                    const s = bus.transient.subscribe(transient => this._state = transient);
                    observer.next(bus);
                    return () => {
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
