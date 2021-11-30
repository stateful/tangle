import {
    of,
    map,
    take,
    toArray,
} from 'rxjs';

import type { Provider } from './types';
import BaseChannel from './channel';

export default class IFrameChannel<T> extends BaseChannel<HTMLIFrameElement, T> {
    public providers: HTMLIFrameElement[] = [];

    constructor (
        namespace: string,
        defaultValue?: Required<T>,
        /**
         * for testing purposes
         */
        private _window = window
    ) {
        super(namespace, defaultValue);
    }

    register (providers: HTMLIFrameElement[]) {
        this.providers.push(...providers);
        return of(...providers).pipe(
            take(providers.length),
            toArray(),
            map((ps: HTMLIFrameElement[]) => ps.map((p) => (<Provider>{
                onMessage: (listener) => {
                    this._window.onmessage = (ev) => listener(ev.data);
                },
                postMessage: (message) => {
                    if (!p.contentWindow) {
                        throw new Error('No content window found');
                    }
                    p.contentWindow.postMessage(message, '*');
                },
            }))),
            map(this._initiateBus.bind(this))
        );
    }

    attach () {
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
