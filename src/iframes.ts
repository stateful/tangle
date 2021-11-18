import {
    of,
    map,
    take,
    toArray,
} from 'rxjs';

import type { Provider } from './types';
import BaseChannel from './channel';

export default class Channel<T> extends BaseChannel<HTMLIFrameElement, T> {
    public providers: HTMLIFrameElement[] = [];

    register (providers: HTMLIFrameElement[]) {
        this.providers.push(...providers);
        return of(...providers).pipe(
            take(providers.length),
            toArray(),
            map((ps: HTMLIFrameElement[]) => ps.map((p) => (<Provider>{
                onMessage: (listener) => {
                    window.onmessage = (ev) => listener(ev.data);
                },
                postMessage: (message) => {
                    if (!p.contentWindow) {
                        throw new Error('No content window found');
                    }
                    p.contentWindow.postMessage(message);
                    return Promise.resolve();
                },
            }))),
            map(this._initiateBus.bind(this))
        );
    }

    attach () {
        return this._initiateClient(<Provider>{
            onMessage: (listener: EventListener) => {
                window.onmessage = (ev) => listener(ev.data);
            },
            postMessage: (message: any) => {
                if (!window.top) {
                    throw new Error('No top window found!');
                }
                window.top.postMessage(message);
                return Promise.resolve();
            }
        });
    }
}
