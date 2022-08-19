import {
    of,
    map,
    scan,
    switchMap,
    Observable,
} from 'rxjs';
import { parentPort } from 'worker_threads';
import type { Worker } from 'worker_threads';

import BaseChannel from './channel';
import type { Provider } from './types';
import type { Bus, Client } from './tangle';


export default class WorkerThreadChannel<T> extends BaseChannel<Worker, T> {
    public providers: Worker[] = [];

    register(providers: Worker[], dispose = true): Observable<Bus<T>> {
        this.providers.push(...providers);
        const providers$ = of(...providers).pipe(
            map((p) => (<Provider>{
                onMessage: (listener) => {
                    p.on('message', listener);
                },
                postMessage: (message) => {
                    p.postMessage(message);
                }
            })),
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

    attach(): Client<T> {
        if (!parentPort) {
            throw new Error('You can only attach to a message bus within a worker thread');
        }

        const pp = parentPort;
        return this._initiateClient(<Provider>{
            onMessage: (listener: EventListener) => {
                pp.on('message', listener);
            },
            postMessage: (message: any) => {
                pp.postMessage(message);
                return Promise.resolve();
            }
        });
    }
}
