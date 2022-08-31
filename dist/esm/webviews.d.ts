import { Observable } from 'rxjs';
import BaseChannel from './channel';
import { Bus } from './tangle';
import { Webview } from 'vscode';
export default class WebViewChannel<T> extends BaseChannel<Webview, T> {
    register(providers: Observable<Webview>[]): Observable<Bus<T>>;
    register(providers: Webview[]): Observable<Bus<T>>;
    attach(webview: Webview): import("./tangle").Client<T>;
}
//# sourceMappingURL=webviews.d.ts.map