'use strict';

var worker_threads = require('worker_threads');
var channel = require('./channel-5757639e.js');
require('./tangle-bdca56c6.js');

class WorkerThreadChannel extends channel.BaseChannel {
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
        if (!worker_threads.parentPort) {
            throw new Error('You can only attach to a message bus within a worker thread');
        }
        const pp = worker_threads.parentPort;
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

module.exports = WorkerThreadChannel;
