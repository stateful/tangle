import { B as BaseChannel } from './channel-a4485895.js';
import './tangle-683e1df4.js';

class WebWorkerChannel extends BaseChannel {
    register(providers) {
        return this._register(providers, (p) => ({
            onMessage: (listener) => {
                p.onmessage = (ev) => listener(ev.data);
            },
            postMessage: (message) => {
                p.postMessage(message);
            }
        }));
    }
    attach() {
        return this._initiateClient({
            onMessage: (listener) => {
                addEventListener('message', (ev) => listener(ev.data));
            },
            postMessage: (message) => {
                postMessage(message);
                return Promise.resolve();
            }
        });
    }
}

export { WebWorkerChannel as default };
