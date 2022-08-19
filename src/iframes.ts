import {
    map,
    Observable,
    of,
    scan,
    switchMap,
} from 'rxjs';

import type { Provider } from './types';
import BaseChannel from './channel';
import type { Bus } from './tangle';

export default class IFrameChannel<T> extends BaseChannel<HTMLIFrameElement, T> {
    public providers: HTMLIFrameElement[] = [];

    constructor(
        namespace: string,
        defaultValue?: Required<T>,
        /**
         * for testing purposes
         */
        private _window = window
    ) {
        super(namespace, defaultValue);
    }

    register(providers: HTMLIFrameElement[], dispose = true) : Observable<Bus<T>> {
        this.providers.push(...providers);
        const providers$ = of(...providers).pipe(
            map((p) => (<Provider>{
                onMessage: (listener) => {
                    this._window.onmessage = (ev) => listener(ev.data);
                },
                postMessage: (message) => {
                    if (!p.contentWindow) {
                        throw new Error('No content window found');
                    }
                    p.contentWindow.postMessage(message, '*');
                },
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

    attach() {
        return this._initiateClient(<Provider>{
            onMessage: (listener: EventListener) => {
                this._window.onmessage = (ev) => listener(ev.data);
            },
            postMessage: (message: any) => {
                if (!this._window.top) {
                    throw new Error('No top window found!');
                }
                this._window.top.postMessage(message, '*');
                return Promise.resolve();
            }
        });
    }
}
