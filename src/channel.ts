import { Provider } from './types';
import { Client, Bus } from './vrx';

export default class BaseChannel<T> {
    constructor (
        private _namespace: string,
        private _defaultValue: T,
    ) {}

    protected _initiateBus (providers: Provider[]) {
        return new Bus<T>(this._namespace, this._defaultValue, providers);
    }

    protected _initiateClient (provider: Provider) {
        return new Client<T>(this._namespace, this._defaultValue, [provider]);
    }
}
