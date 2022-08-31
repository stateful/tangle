import { B as BaseChannel } from './channel-6251a58b.js';
import './tangle-9a7593a9.js';

class WebViewChannel extends BaseChannel {
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

export { WebViewChannel as default };
