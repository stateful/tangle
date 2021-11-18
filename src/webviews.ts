import vscode from 'vscode';
import {
    of,
    map,
    take,
    merge,
    toArray,
} from 'rxjs';

import type { Provider, WebviewProvider } from './types';
import BaseChannel from './channel';

declare global {
    // eslint-disable-next-line
    var acquireVsCodeApi: () => vscode.Webview;
}

type ProviderType = WebviewProvider | vscode.WebviewPanel;

export default class WebViewChannel<T> extends BaseChannel<ProviderType, T> {
    public providers: WebviewProvider[] = [];

    register (providers: ProviderType[]) {
        const providerWithPanels = providers.map((provider) => {
            const panel = provider as vscode.WebviewPanel;
            return panel.viewType
                ? <WebviewProvider>{ webview: of(panel.webview), identifier: panel.viewType }
                : (provider as WebviewProvider);
        });

        this.providers.push(...providerWithPanels);
        return merge(...providerWithPanels.map((p) => p.webview)).pipe(
            take(providers.length),
            toArray(),
            map((ps: vscode.Webview[]) => ps.map((p) => (<Provider>{
                onMessage: p.onDidReceiveMessage.bind(p),
                postMessage: (message) => new Promise((resolve) => {
                    p.postMessage(message).then(() => resolve());
                }),
            }))),
            map(this._initiateBus.bind(this))
        );
    }

    attach (webview: vscode.Webview) {
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
