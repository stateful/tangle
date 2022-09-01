'use strict';

var channel = require('./channel-5757639e.js');
require('./tangle-bdca56c6.js');

class WebWorkerChannel extends channel.BaseChannel {
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

module.exports = WebWorkerChannel;
