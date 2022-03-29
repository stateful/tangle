import {
    of,
    map,
    take,
    toArray,
    Observable,
} from 'rxjs';

import BaseChannel from './channel';
import type { Provider } from './types';
import type { Bus, Client } from './tangle';

export default class WebWorkerChannel<T> extends BaseChannel<Worker, T> {
    public providers: Worker[] = [];

    register(providers: Worker[]): Observable<Bus<T>> {
        this.providers.push(...providers);
        return of(...providers).pipe(
            take(providers.length),
            toArray(),
            map((ps) => ps.map((p) => (<Provider>{
                onMessage: (listener) => {
                    p.onmessage = (ev) => listener(ev.data);
                },
                postMessage: (message) => {
                    p.postMessage(message);
                }
            }))),
            map(this._initiateBus.bind(this))
        );
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
