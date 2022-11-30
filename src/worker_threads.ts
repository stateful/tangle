import { Observable } from 'rxjs';
import { parentPort } from 'worker_threads';
import type { Worker } from 'worker_threads';

import BaseChannel from './channel';
import type { Provider } from './types';
import type { Bus, Client } from './tangle';


export default class WorkerThreadChannel<T> extends BaseChannel<Worker, T> {
    register(providers: Worker[]): Observable<Bus<T>> ;
    register(providers: Observable<Worker>[]): Observable<Bus<T>> ;
    register(providers: Observable<Worker>[] | Worker[]): Observable<Bus<T>> {
        return this._register(providers, (p: Worker) => (<Provider>{
            onMessage: (listener) => p.on('message', listener),
            postMessage: (message) => p.postMessage(message)
        }));
    }

    attach(): Client<T> {
        if (!parentPort) {
            throw new Error('You can only attach to a message bus within a worker thread');
        }

        const pp = parentPort;
        return this._initiateClient(<Provider>{
            onMessage: (listener: EventListener) => pp.on('message', listener),
            postMessage: (message: any) => {
                pp.postMessage(message);
                return Promise.resolve();
            }
        });
    }
}
