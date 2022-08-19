import type { Observable } from 'rxjs';

import type { Provider } from './types';
import BaseChannel from './channel';
import type { Bus } from './tangle';

export default class IFrameChannel<T> extends BaseChannel<HTMLIFrameElement, T> {
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

    register(providers: HTMLIFrameElement[], dispose?: boolean): Observable<Bus<T>>;
    register(providers: Observable<HTMLIFrameElement>[], dispose?: boolean): Observable<Bus<T>>;
    register(providers: any, dispose = true): Observable<Bus<T>> {
        return this._register(providers, (p) => (<Provider>{
            onMessage: (listener) => {
                this._window.onmessage = (ev) => listener(ev.data);
            },
            postMessage: (message) => {
                if (!p.contentWindow) {
                    throw new Error('No content window found');
                }
                p.contentWindow.postMessage(message, '*');
            },
        }), dispose);
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
