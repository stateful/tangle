import { Subscription } from 'rxjs';

export interface Messenger {
    postMessage: (message: any) => void
}

export interface Context {
    clients: Map<string, boolean>;
}

export type Payload<T> = { transient: T, event?: Record<string, any>, context: Context };
export type Listener<T> = (value: T) => void;
export type RegisteredEvent<T> = { fn: <K extends keyof T>(value: T[K]) => void, obs: Subscription };

/**
 * ToDo(Christian): eventually give this a more general type,
 * e.g. `Pick<EventTarget, 'dispatchEvent'>` and therefor stay
 * closer to native existing interfaces
 */
export interface Provider {
    onMessage: (listener: EventListener) => void;
    /**
     * ToDo(Christian): promise as return value might be required
     * for webviews but not for other environments
     */
    postMessage: (message: any) => void;
}

export interface Receiver {
    /**
     * ToDo(Christian): eventually add `AddEventListenerOptions`
     */
    addEventListener(
        type: string,
        callback: (evt: Event) => void | null
    ): void;
}
