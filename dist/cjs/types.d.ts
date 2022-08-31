import { Subscription } from 'rxjs';
export interface Messenger {
    postMessage: (message: any) => void;
}
export interface Context {
    clients: Map<string, boolean>;
}
export declare type Payload<T> = {
    transient: T;
    event?: Record<string, any>;
    context: Context;
};
export declare type Listener<T> = (value: T) => void;
export declare type RegisteredEvent<T> = {
    fn: <K extends keyof T>(value: T[K]) => void;
    obs: Subscription;
};
export interface Provider {
    onMessage: (listener: EventListener) => void;
    postMessage: (message: any) => void;
}
export interface Receiver {
    addEventListener(type: string, callback: (evt: Event) => void | null): void;
}
//# sourceMappingURL=types.d.ts.map