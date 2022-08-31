import { B as BaseChannel } from './channel-a4485895.js';
import './tangle-683e1df4.js';

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
