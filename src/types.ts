import vscode from 'vscode';
import { Observable } from 'rxjs';

export interface Messenger {
    postMessage: (message: any) => void
}

export interface WebviewProvider {
    webview: Observable<vscode.Webview>;
    identifier: string;
}

export type EventName = string | symbol;
export type Payload<T> = { transient: T, event?: Record<string, any> };
export type Listener = (...args: any[]) => void;

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
    postMessage: (message: any) => Promise<void>;
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
