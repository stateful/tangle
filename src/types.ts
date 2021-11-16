import vscode from 'vscode';
import { Observable } from 'rxjs';

export interface Messenger {
    postMessage: (message: any) => void
}

export interface WebviewProvider {
    webview: Observable<vscode.Webview>;
    identifier: string;
}

/**
 * ToDo(Christian): eventually give this a more general type,
 * e.g. `Pick<EventTarget, 'dispatchEvent'>` and therefor stay
 * closer to native existing interfaces
 */
export interface Provider {
    onMessage: (listener: EventListener) => void;
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