'use strict';

var channel = require('./channel-66ab57c1.js');
require('./tangle-31ff6760.js');

class WebViewChannel extends channel.BaseChannel {
    register(providers) {
        return this._register(providers, (p) => ({
            onMessage: p.onDidReceiveMessage.bind(p),
            postMessage: p.postMessage.bind(p),
        }));
    }
    attach(webview) {
        return this._initiateClient({
            onMessage: (listener) => {
                window.addEventListener('message', (event) => listener(event.data));
            },
            postMessage: (message) => {
                webview.postMessage(message);
                return Promise.resolve();
            }
        });
    }
}

module.exports = WebViewChannel;
