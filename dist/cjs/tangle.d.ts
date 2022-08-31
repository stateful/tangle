import { Observable } from 'rxjs';
import type { Provider, Payload, Listener, Context } from './types';
export declare class Client<T> {
    readonly namespace: string;
    readonly providers: Provider[];
    readonly defaultValue: T;
    private readonly _isBus;
    readonly id: string;
    readonly context: Observable<Context>;
    private readonly _outbound;
    private readonly _inbound;
    private readonly _events;
    private readonly _notifer;
    private readonly _transient;
    private readonly _eventMap;
    protected readonly _context: Context;
    constructor(namespace: string, providers: Provider[], defaultValue: T, _isBus?: boolean);
    get events(): Observable<Payload<T>>;
    get transient(): Observable<T>;
    get state(): T;
    dispose(): void;
    notify(): void;
    private _registerContext;
    broadcast(state: T): void;
    listen<K extends keyof T>(eventName: K, fn: Listener<T[K]>): import("rxjs").Subscription;
    emit<K extends keyof T>(eventName: K, payload: T[K]): void;
    on<K extends keyof T>(eventName: K, fn: Listener<T[K]>): import("rxjs").Subscription;
    once<K extends keyof T>(eventName: K, fn: Listener<T[K]>): import("rxjs").Subscription;
    off<K extends keyof T>(eventName: K, listener: Listener<T[K]>): this;
    eventNames(): (keyof T)[];
    listenerCount<K extends keyof T>(eventName: K): number;
    listeners<K extends keyof T>(eventName: K): (<K_1 extends keyof T>(value: T[K_1]) => void)[];
    removeAllListeners(): this;
    private _registerEvent;
    private _register;
    private _fromProviders;
    private _fold;
}
export declare class Bus<T> extends Client<T> {
    constructor(namespace: string, providers: Provider[], defaultValue: T);
    whenReady(): Promise<Context>;
}
export * from './types';
//# sourceMappingURL=tangle.d.ts.map