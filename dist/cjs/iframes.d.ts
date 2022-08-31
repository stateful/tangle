import type { Observable } from 'rxjs';
import BaseChannel from './channel';
import type { Bus } from './tangle';
export default class IFrameChannel<T> extends BaseChannel<HTMLIFrameElement, T> {
    private _window;
    constructor(namespace: string, defaultValue?: Required<T>, _window?: Window & typeof globalThis);
    register(providers: HTMLIFrameElement[]): Observable<Bus<T>>;
    register(providers: Observable<HTMLIFrameElement>[]): Observable<Bus<T>>;
    attach(): import("./tangle").Client<T>;
}
//# sourceMappingURL=iframes.d.ts.map