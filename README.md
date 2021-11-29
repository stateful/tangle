Tangle [![Test Changes](https://github.com/stateful/tangle/actions/workflows/test.yaml/badge.svg)](https://github.com/stateful/tangle/actions/workflows/test.yaml)
======

> JavaScript message bus implementation for various of different sandbox environments, e.g. [worker threads](https://nodejs.org/api/worker_threads.html), [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers), [iframes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [Visual Studio Code Webviews](https://code.visualstudio.com/api/extension-guides/webview) etc.

`tangle` allows to sync states between various components that live in different sandbox environments, e.g. iframes, webworkers, worker threads or VSCode webviews. It simplifies the communication between these sandboxes drastically. The package was mainly developed to help share data between various of webviews within a VSCode extension.

❗❗ __Note:__ This package is in active development and not quite ready for prime just yet. Use it with cautions! ❗❗

# Demo

The ToDo list can be easily shared between 4 different iFrames. You can find this demo in the [example directory](https://github.com/stateful/tangle/tree/main/examples/iframes).

![Demo](https://raw.githubusercontent.com/stateful/tangle/main/.github/workflows/test.yaml?token=AAFSRSIXJGSY76IZ7L4NSULBU6VZQ)

# Install

To install the package, run:

```sh
npm i --save tangle
```

or via Yarn:

```sh
yarn add tangle
```

# Usage

This package allows to share a state or send events around various of environments. Make sure you use the correct import based on your use case:

- to broadcast messages between various worker threads
    ```js
    import Channel from 'tangle/worker_threads';
    ```
- to broadcast messages between various web workers in the browser
    ```js
    import Channel from 'tangle/webworkers';
    ```
- to broadcast messages between VSCode webviews
    ```js
    import Channel from 'tangle/webviews';
    ```
- to broadcast messages between iFrames
    ```js
    import Channel from 'tangle/iframes';
    ```
- more to come...

## State Management

Using the methods `listen(eventName: keyof T, fn: Listener)` and `broadcast(state: T)` you can share the state of an object. `T` defines the interface of an object representing the state. When initiating a channel you need to pass in the initialization value of that state, e.g.:

```ts
import Channel from 'tangle/worker_threads';

interface TodoList {
    todos: string[]
    dueDate: number
}

const ch = new Channel<TodoList>('foobar', {
    todos: [],
    dueDate: Date.now()
});
```

Now you can use `listen` to get notified when the state of a certain property changes and `broadcast` to update one or multiple properties of that state.

### Example: Usage with Node.js Worker Threads

Within the parent thread, setup a message with a channel name and a default state:

```js
import { Worker } from 'worker_threads';
import Channel from 'tangle/worker_threads';

const ch = new Channel('foobar', {
    counter: 0
});

/**
 * register message bus
 *
 * you can also work with it using RxJS Observables, e.g.:
 * ```js
 * const bus = ch.register([...]).subscribe((bus) => ...)
 * ```
 */
const bus = await ch.registerPromise([
    new Worker('./worker.js', { workerData: 'worker #1' }),
    new Worker('./worker.js', { workerData: 'worker #2' }),
    new Worker('./worker.js', { workerData: 'worker #3' })
])

bus.listen('counter', (counter) => console.log(`Counter update: ${counter}`))
```

Within the worker file you can attach to the message bus and share messages across all worker threads:

```js
// in ./worker.js
import { workerData } from 'worker_threads';
import Channel from 'tangle/worker_threads';

const ch = new Channel('foobar', {
    counter: 0
});
const client = ch.attach();

if (workerData === 'worker #1') {
    client.broadcast({ counter: client.state.counter + 1 })
}
if (workerData === 'worker #2') {
    setTimeout(() => {
        client.broadcast({ counter: client.state.counter + 1 })
    }, 100)
}
if (workerData === 'worker #3') {
    setTimeout(() => {
        client.broadcast({ counter: client.state.counter + 1 })
    }, 200)
}
```

Given there are 3 worker threads attached to the message bus, the program would print:

```
Counter update: 0
Counter update: 1
Counter update: 2
Counter update: 3
```

__Note:__ if you listen to a state property _Tangle_ will immeditially emit the current value of that property.

### Example: Usage with VSCode Webviews

When you initialize your extension and all your webviews and panels, create a message bus and attach all of them to it, e.g.:

```ts
import vscode from "vscode";
import Channel from 'tangle/webviews';
import type { WebviewProvider } from 'tangle';

class PanelViewProvider implements vscode.WebviewViewProvider, WebviewProvider {
    public view?: vscode.WebviewView;
    private _webview = new Subject<vscode.Webview>();

    constructor(
        private readonly _context: vscode.ExtensionContext,
        public readonly identifier: string
    ) {}

    resolveWebviewView(...) {
        // ...
    }

    public static register(context: vscode.ExtensionContext, identifier: string) {
        const panelProvider = new PanelViewProvider(context, identifier);
        context.subscriptions.push(vscode.window.registerWebviewViewProvider(identifier, panelProvider));
        return panelProvider;
    }

    public get webview() {
        return this._webview.asObservable();
    }
}

export async function activate (context: vscode.ExtensionContext) {
    const ch = new Channel('vscode_state', { ... });
    const bus = await ch.registerPromise([
        vscode.window.createWebviewPanel(...),
        vscode.window.createWebviewPanel(...),
        PanelViewProvider.register(context, 'panel1')
    ])
}
```

Within the webviews you can assign to the same channel and send messages across. The `attach` method takes the instance of the webview which you receive by calling `acquireVsCodeApi`, e.g.:

```js
import Channel from 'tangle/webviews';

const vscode = acquireVsCodeApi()
const ch = new Channel('vscode_state', {});
const client = ch.attach(vscode);

client.broadcast({ ... });
```

You can find more examples for other environments in the [examples](./examples) folder.

## Event Handling

As oppose to managing state between JavaScript sandboxes you can use Tangle to just send around events among these environments. For this usecase, no default value for the state is necessary. The interface for event handling is the same as defined for the Node.js [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter), e.g.:

```js
import { Worker } from 'worker_threads';
import Channel from 'tangle/worker_threads';

const ch = new Channel('foobar');
const bus = await ch.registerPromise([
    new Worker('./worker.js', { workerData: 'worker #1' }),
    new Worker('./worker.js', { workerData: 'worker #2' }),
    new Worker('./worker.js', { workerData: 'worker #3' })
])

/**
 * listen to events using `on` or `once`
 */
bus.on('someEvent', (payload) => console.log(`New event: ${payload}`))
```

```js
// in ./worker.js
import { workerData } from 'worker_threads';
import Channel from 'tangle/worker_threads';

const ch = new Channel('foobar');
const client = ch.attach();
client.emit('someEvent', workerData)
```

Given there are 3 worker threads attached to the message bus, the program would print:

```
worker #2
worker #1
worker #3
```

### Typed Event Handling

Similar with state management you can define types for events and their payloads, e.g.:

```ts
interface Events {
    foo: string
    bar: number
}

const ch = new Channel<Events>('foobar');
const client = ch.attach();
client.emit('foo', 'bar')
client.emit('bar', true) // 🚨 fails with "Argument of type 'number' is not assignable to parameter of type 'boolean'.ts(2345)"
client.emit('foobar', true) // 🚨 fails with "Argument of type '"foobar"' is not assignable to parameter of type 'keyof Events'.ts(2345)"
```

# Contribute

You have an idea on how to improve the package, please send us a pull request! Have a look into our [contributing guidelines](CONTRIBUTING.md).

# Getting Help

Running into issues or are you missing a specific usecase? Feel free to [file an issue](https://github.com/stateful/tangle/issues/new).

---

<p align="center"><small>Copyright 2021 © <a href="http://stateful.com/">Stateful</a> – Apache 2.0 License</small></p>
