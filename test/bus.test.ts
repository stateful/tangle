import tap from 'tap';
import { EventEmitter } from 'events';
import { Observable } from 'rxjs';
import type { Webview } from 'vscode';

import { forWebviews, forDOM, Bus } from '../src/vrx';
import { Messenger, Receiver, WebviewProvider } from '../src/types';
import { of } from 'rxjs';

const disposable = { dispose: () => { return null; }, };
const emitter = new EventEmitter();
const eventEmitter = new EventEmitter();
const webviewMock: Webview = {
    options: {},
    html: '',
    onDidReceiveMessage: function (listener) {
        eventEmitter.on('message', listener);
        return disposable;
    },
    postMessage: (message: any) => {
        emitter.emit('message', message);
        return Promise.resolve(true);
    },
    cspSource: 'foobar',
    asWebviewUri: (localResource) => localResource
};


const receiver: Receiver = {
    addEventListener: (type: string, cb: (evt: Event) => void) => emitter.on(type, cb)
};
const messenger: Messenger = {
    postMessage: (message: any) => eventEmitter.emit('message', message)
};
const clientA = forDOM<Payload>('test1', receiver, messenger, {});


const sleep = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));
const webviews: WebviewProvider[] = [webviewMock, webviewMock].map((wv, i) => ({
    webview: of(wv),
    identifier: `webview${i}`
}));

interface Payload {
    onFromClient?: string
}

tap.test('has a transient getter', (t) => {
    const bus = new Bus<object>("testing", {}, []);
    t.ok(bus.transient instanceof Observable);
    t.end();
});

tap.test('client with simple event emitter', (t) => {
    forWebviews<Payload>('test1', {}, webviews).subscribe(async (bus) => {
        let busMessages = '';
        bus.listen('onFromClient', (data) => (busMessages += data));
        clientA.broadcast({ onFromClient: 'foo' });
        await sleep();
        t.equal(busMessages, 'foofoo');
        t.end();
    });
});