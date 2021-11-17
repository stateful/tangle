import {
    of,
    map,
    take,
    toArray,
    Observable,
} from 'rxjs';
import { parentPort } from 'worker_threads';
import type { Worker } from 'worker_threads';

import BaseChannel from './channel';
import type { Provider } from './types';
import type { Bus, Client } from './vrx';


export default class Channel<T> extends BaseChannel<Worker, T> {
    public providers: Worker[] = [];

    register (providers: Worker[]): Observable<Bus<T>> {
        this.providers.push(...providers);
        return of(...providers).pipe(
            take(providers.length),
            toArray(),
            map((ps) => ps.map((p) => (<Provider>{
                onMessage: (listener) => {
                    p.on('message', listener);
                },
                postMessage: (message) => {
                    p.postMessage(message);
                    return Promise.resolve();
                }
            }))),
            map(this._initiateBus.bind(this))
        );
    }

    attach (): Client<T> {
        if (!parentPort) {
            throw new Error('You can only attach to a message bus within a worker thread');
        }

        const pp = parentPort;
        return this._initiateClient(<Provider>{
            onMessage: (listener: EventListener) => {
                pp.on('message', (event) => listener(event));
            },
            postMessage: (message: any) => {
                pp.postMessage(message);
                return Promise.resolve();
            }
        });
    }
}
