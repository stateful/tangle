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

export default class Channel<T> extends BaseChannel<T> {
    public providers: WebviewProvider[] = [];

    register (providers: (WebviewProvider | vscode.WebviewPanel)[]) {
        const providerWithPanels = providers.map((provider) => {
            const panel = provider as vscode.WebviewPanel;
            return panel.webview
                ? <WebviewProvider>{ webview: of(panel.webview), identifier: panel.viewType }
                : (provider as WebviewProvider);
        });

        this.providers.push(...providerWithPanels);
        return merge(...providerWithPanels.map((p) => p.webview)).pipe(
            take(providers.length),
            toArray(),
            map((ps) => ps.map((p) => (<Provider>{
                onMessage: p.onDidReceiveMessage.bind(p),
                postMessage: (message) => new Promise((resolve) => {
                    p.postMessage(message).then(() => resolve());
                }),
            }))),
            map(this._initiateBus.bind(this))
        );
    }

    attach () {
        if (typeof global.acquireVsCodeApi !== 'function') {
            throw new Error('You can only attach to a message bus within a VSCode Webview');
        }

        const vscode = global.acquireVsCodeApi();
        return this._initiateClient(<Provider>{
            onMessage: (listener: EventListener) => {
                window.addEventListener('message', (event) => listener(event));
            },
            postMessage: (message: any) => {
                vscode.postMessage(message);
                return Promise.resolve();
            }
        });
    }
}
