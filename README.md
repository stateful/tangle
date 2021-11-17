messagebus [![Test Changes](https://github.com/stateful/vscoderx/actions/workflows/test.yaml/badge.svg)](https://github.com/stateful/vscoderx/actions/workflows/test.yaml)
==========

> JavaScript message bus implementation for various of different sandbox environments, e.g. worker threads, vscode webviews etc.

`messagebus` allows to sync states between various components that live in different sandbox environments, e.g. worker threads or VSCode webviews. It simplifies the communication between these sandboxes drastically. The package was mainly developed to help share data between various of webviews within a VSCode extension.

# Install

To install the package, run:

```sh
npm i --save messagebus
```

or via Yarn:

```sh
yarn add messagebus
```

# Usage

This package allows to setup message buses in various of environments. Make sure you use the correct import based on your use case:

- to broadcast messages between various worker threads
    ```js
    import Channel from 'messagebus/worker_threads';
    ```
- to broadcast messages between VSCode webviews
    ```js
    import Channel from 'messagebus/webviews';
    ```
- more to come...

## Usage with Node.js Worker Threads

Within the parent thread, setup a message with a channel name and a default state:

```js
import { Worker } from 'worker_threads';
import Channel from 'messagebus/worker_threads';

const ch = new Channel('foobar', {});

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

bus.listen('onCustomEvent', ({ message }) => console.log(message))
```

Within the worker file you can attach to the message bus and share messages across all worker threads:

```js
// in ./worker.js
import { workerData } from 'worker_threads';
import Channel from 'messagebus/worker_threads';

const ch = new Channel('foobar', {});
const client = ch.attach();

client.broadcast({ onCustomEvent: `Hello World from ${workerData} 👋 !` })
```

Given there are 3 worker threads attached to the message bus, the program would print:

```
Hello World from worker #2 👋 !
Hello World from worker #1 👋 !
Hello World from worker #3 👋 !
```

__Note:__ the initialization of a worker process is asynchronous which is why events aren't send in order.

## Usage with VSCode Webviews

When you initialize your extension and all your webviews and panels, create a message bus and attach all of them to it, e.g.:

```ts
import vscode from "vscode";
import Channel from 'messagebus/webviews';
import type { WebviewProvider } from 'messagebus';

class PanelViewProvider implements vscode.WebviewViewProvider, Vrx.WebviewProvider {
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
    const ch = new Channel('vscode_state', {});
    const bus = await ch.registerPromise([
        vscode.window.createWebviewPanel(...),
        vscode.window.createWebviewPanel(...),
        PanelViewProvider.register(context, 'panel1')
    ])
}
```

Within the webviews you can assign to the same channel and send messages across, e.g.:

```js
import Channel from 'messagebus/worker_threads';

const ch = new Channel('vscode_state', {});
const client = ch.attach();

client.broadcast({ onCustomEvent: 'Hello from webview 👋 !' });
```

# Contribute

You have an idea on how to improve the package, please send us a pull request! Have a look into our [contributing guidelines](CONTRIBUTING.md).

# Getting Help

Running into issues or are you missing a specific usecase? Feel free to [file an issue](https://github.com/saucelabs/node-zap/issues/new).

---

<div style="text-align: center"><small>Copyright 2021 © <a href="http://stateful.com/">Stateful</a> – Apache 2.0 License</small></div>
