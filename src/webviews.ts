import {
    merge,
    map,
    take,
    toArray,
    Observable,
    of
} from 'rxjs';
import type { Webview } from 'vscode';
import type { Provider } from './types';
import BaseChannel from './channel';

/**
 * In VSCode web views are created when opened by the extension
 * therefor we don't always know when this instance is available.
 * RxJS helps here to initiate the channel only once that happened.
 */
type WebviewProvider = Observable<Webview> | Webview;

export default class WebViewChannel<T> extends BaseChannel<WebviewProvider, T> {
    public providers: Observable<Webview>[] = [];

    register(providers: WebviewProvider[]) {
        const observableProvider: Observable<Webview>[] = providers.map((p) => {
            const panel = p as Webview;
            return typeof panel.html === 'string' ? of(panel) : (p as Observable<Webview>);
        });

        this.providers.push(...observableProvider);
        return merge(...observableProvider).pipe(
            take(providers.length),
            toArray(),
            map((ps: Webview[]) => ps.map((p) => (<Provider>{
                onMessage: p.onDidReceiveMessage.bind(p),
                postMessage: p.postMessage.bind(p),
            }))),
            map(this._initiateBus.bind(this))
        );
    }

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
