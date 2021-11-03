import * as vscode from "vscode";
import { BehaviorSubject, Observable, Subject } from "rxjs";
export interface WebviewProvider {
    webview: Observable<vscode.Webview>;
    identifier: string;
}
export interface Provider {
    onMessage: (listener: EventListener) => void;
    postMessage: (message: any) => Promise<void>;
}
export declare function wrapPanel(panel: vscode.WebviewPanel): WebviewProvider;
export declare function forWebviews<T>(namespace: string, defaultValue: T, wvProviders: WebviewProvider[]): Observable<Bus<T>>;
export declare function forDOM<T>(namespace: string, defaultValue: T, window: Window, vscode: {
    postMessage: (message: any) => void;
}): Client<T>;
export declare class Client<T> {
    readonly namespace: string;
    readonly defaultValue: T;
    readonly providers: Provider[];
    private readonly _isBus;
    protected readonly _outbound: Subject<T>;
    protected readonly _inbound: BehaviorSubject<T>;
    protected readonly _events: Subject<T>;
    protected readonly _transient: Observable<T>;
    constructor(namespace: string, defaultValue: T, providers: Provider[], _isBus?: boolean);
    get events(): any;
    get transient(): any;
    broadcast(transient: T): void;
    listen(key: keyof T, fn: (...args: any[]) => void): void;
    on(eventName: string, fn: (...args: any[]) => void): void;
    onAll(fn: (...args: any[]) => void): void;
    subscribe(key: keyof T, fn: (...args: any[]) => void, distinctUntilChanged?: boolean): any;
    protected register(): Observable<T>;
    protected fromProviders(): (source: any) => any;
    protected dedupe(): (source: any) => any;
    protected fold(acc: T, one: T): T;
    protected fromEntries(accum: T, [k, v]: [string, any]): T;
    protected grouped(): (source: any) => any;
}
export declare class Bus<T> extends Client<T> {
    constructor(namespace: string, defaultValue: T, providers: Provider[]);
}
//# sourceMappingURL=vrx.d.ts.map