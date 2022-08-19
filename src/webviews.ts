import { Observable } from 'rxjs';
import type { Provider } from './types';
import BaseChannel from './channel';
import { Bus } from './tangle';
import { Webview } from 'vscode';

/**
 * In VS Code web views are created when opened by the extension
 * therefor we don't always know when this instance is available.
 * RxJS helps here to initiate the channel only once that happened.
 */

export default class WebViewChannel<T> extends BaseChannel<Webview, T> {
    register(providers: Observable<Webview>[], dispose?: boolean): Observable<Bus<T>> ;
    register(providers: Webview[], dispose?: boolean): Observable<Bus<T>> ;
    register(providers: any, dispose = true): Observable<Bus<T>> {
        return this._register(providers, (p) => (<Provider>{
            onMessage: p.onDidReceiveMessage.bind(p),
            postMessage: p.postMessage.bind(p),
        }), dispose);
    }

    // TODO: perhaps type union here? since technically DOM-based envs don't have Webview
    attach(webview: Webview) {
        return this._initiateClient(<Provider>{
            onMessage: (listener: EventListener) => {
                window.addEventListener('message', (event) => listener(event.data));
            },
            postMessage: (message: any) => {
                webview.postMessage(message);
                return Promise.resolve();
            }
        });
    }
}
