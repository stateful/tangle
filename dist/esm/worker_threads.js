import { parentPort } from 'worker_threads';
import { B as BaseChannel } from './channel-6251a58b.js';
import './tangle-9a7593a9.js';

class WorkerThreadChannel extends BaseChannel {
    register(providers) {
        return this._register(providers, (p) => ({
            onMessage: (listener) => {
                p.on('message', listener);
            },
            postMessage: (message) => {
                p.postMessage(message);
            }
        }));
    }
    attach() {
        if (!parentPort) {
            throw new Error('You can only attach to a message bus within a worker thread');
        }
        const pp = parentPort;
        return this._initiateClient({
            onMessage: (listener) => {
                pp.on('message', listener);
            },
            postMessage: (message) => {
                pp.postMessage(message);
                return Promise.resolve();
            }
        });
    }
}

export { WorkerThreadChannel as default };
