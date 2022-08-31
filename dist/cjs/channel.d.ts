import { Observable } from 'rxjs';
import { Provider } from './types';
import { Client, Bus } from './tangle';
export default abstract class BaseChannel<U, T> {
    private _namespace;
    private _defaultValue?;
    providers: U[];
    abstract register(providers: U[] | Observable<U>[]): Observable<Bus<T>>;
    protected _state?: T;
    constructor(_namespace: string, _defaultValue?: Required<T> | undefined);
    protected debounceResolution(count: number, timeout: number): (source: Observable<Provider[]>) => Observable<Provider[]>;
    registerPromise(providers: U[] | Promise<U>[]): Promise<Bus<T>>;
    protected _register(providers: U[] | Observable<U>[], providerMapper: {
        (p: U): Provider;
    }): Observable<Bus<T>>;
    protected _initiateBus(providers: Provider[], previousState?: T): Bus<T>;
    protected _initiateClient(provider: Provider): Client<T>;
}
//# sourceMappingURL=channel.d.ts.map