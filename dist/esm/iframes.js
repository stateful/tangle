import { B as BaseChannel } from './channel-6251a58b.js';
import './tangle-9a7593a9.js';

class IFrameChannel extends BaseChannel {
    constructor(namespace, defaultValue, _window = window) {
        super(namespace, defaultValue);
        this._window = _window;
    }
    register(providers) {
        return this._register(providers, (p) => ({
            onMessage: (listener) => {
                this._window.onmessage = (ev) => listener(ev.data);
            },
            postMessage: (message) => {
                if (!p.contentWindow) {
                    throw new Error('No content window found');
                }
                p.contentWindow.postMessage(message, '*');
            },
        }));
    }
    attach() {
        return this._initiateClient({
            onMessage: (listener) => {
                this._window.onmessage = (ev) => listener(ev.data);
            },
            postMessage: (message) => {
                if (!this._window.top) {
                    throw new Error('No top window found!');
                }
                this._window.top.postMessage(message, '*');
                return Promise.resolve();
            }
        });
    }
}

export { IFrameChannel as default };
