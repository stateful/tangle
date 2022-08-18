import {
    merge,
    map,
    Observable,
    of,
    scan,
    tap,
    debounceTime,
    switchMap
} from 'rxjs';
import type { Webview } from 'vscode';
import type { Provider } from './types';
import BaseChannel from './channel';
import { Bus } from './tangle';

/**
 * In VS Code web views are created when opened by the extension
 * therefor we don't always know when this instance is available.
 * RxJS helps here to initiate the channel only once that happened.
 */
type WebviewProvider = Observable<Webview> | Webview;

export default class WebViewChannel<T> extends BaseChannel<WebviewProvider, T> {
    public providers: Observable<Webview>[] = [];
    private _state?: T;

    register(providers: WebviewProvider[]) {
        const observableProvider: Observable<Webview>[] = providers.map((p) => {
            const panel = p as Webview;
            return typeof panel.html === 'string' ? of(panel) : (p as Observable<Webview>);
        });

        this.providers.push(...observableProvider);
        const providers$ = merge(...observableProvider).pipe(
            map((p) => (<Provider>{
                onMessage: p.onDidReceiveMessage.bind(p),
                postMessage: p.postMessage.bind(p),
            })),
            scan((acc, one) => {
                acc.push(one);
                return acc;
            }, <Provider[]>[]));

        const bus$ = providers$.pipe(
            debounceTime(50),
            tap(providers => {
                console.log(`Emit bus with ${providers.length} providers`);
            }),
            switchMap(providers => {
                return new Observable<Bus<T>>(observer => {
                    const bus = this._initiateBus(providers, this._state);
                    const s = bus.transient.subscribe(transient => this._state = transient);
                    observer.next(bus);
                    return () => {
                        bus.dispose();
                        s.unsubscribe();
                    };
                });
            }),
        );

        return bus$;
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
