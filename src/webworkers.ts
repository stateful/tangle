import {
    Observable,
} from 'rxjs';

import BaseChannel from './channel';
import type { Provider } from './types';
import type { Bus, Client } from './tangle';

export default class WebWorkerChannel<T> extends BaseChannel<Worker, T> {
    register(providers: Worker[], dispose?: boolean): Observable<Bus<T>>;
    register(providers: Observable<Worker>[], dispose?: boolean): Observable<Bus<T>> ;
    register(providers: any, dispose = true): Observable<Bus<T>> {
        return this._register(providers, (p) => (<Provider>{
                onMessage: (listener) => {
                    p.onmessage = (ev) => listener(ev.data);
                },
                postMessage: (message) => {
                    p.postMessage(message);
                }
            }), dispose);
    }

    attach(): Client<T> {
        return this._initiateClient(<Provider>{
            onMessage: (listener: EventListener) => {
                addEventListener('message', (ev) => listener(ev.data));
            },
            postMessage: (message: any) => {
                postMessage(message);
                return Promise.resolve();
            }
        });
    }
}
