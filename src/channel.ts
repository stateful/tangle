import { Observable } from 'rxjs';
import { Provider } from './types';
import { Client, Bus } from './tangle';

export default abstract class BaseChannel<U, T> {
    public abstract register (providers: U[]): Observable<Bus<T>>;

    constructor (
        private _namespace: string,
        private _defaultValue: Required<T>,
    ) {}

    public registerPromise (providers: U[]): Promise<Bus<T>> {
        return new Promise<Bus<T>>((resolve) => (
            this.register(providers).subscribe(resolve)
        ));
    }

    protected _initiateBus (providers: Provider[]) {
        return new Bus<T>(this._namespace, this._defaultValue, providers);
    }

    protected _initiateClient (provider: Provider) {
        return new Client<T>(this._namespace, this._defaultValue, [provider]);
    }
}
