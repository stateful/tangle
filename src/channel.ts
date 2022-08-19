import { debounce, firstValueFrom, timer, Observable } from 'rxjs';
import { Provider } from './types';
import { Client, Bus } from './tangle';

export default abstract class BaseChannel<U, T> {
    public abstract register(providers: U[], dispose?: boolean): Observable<Bus<T>>;
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

    public registerPromise(providers: U[]): Promise<Bus<T>> {
        return firstValueFrom(this.register(providers, false));
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
