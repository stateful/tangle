import { B as BaseChannel } from './channel-6251a58b.js';
import './tangle-9a7593a9.js';

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
