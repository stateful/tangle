import { JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';
import { test } from 'tap';

import Channel from '../src/iframes';

interface State {
    someProp: number
}

const defaultValue = { someProp: 8 };

test('should allow communication between multiple worker threads', async (t) => {
    const resourceLoader = new ResourceLoader({
        proxy: 'http://127.0.0.1:8080',
        strictSSL: false
    });
    const virtualConsole = new VirtualConsole();
    virtualConsole.sendTo(console);
    const dom = new JSDOM('', {
        runScripts: 'outside-only',
        resources: resourceLoader,
        virtualConsole
    });

    const { window } = dom;
    const frame = window.document.createElement('iframe');
    window.document.body.appendChild(frame);

    const frameChannel = new Channel<State>('iframe', defaultValue, window as any);
    const iframeChannel = new Channel<State>('iframe', defaultValue, frame.contentWindow as any);

    let result = 0;
    const bus = await frameChannel.registerPromise([frame]);
    // bus.transient.subscribe(console.log);
    const client = iframeChannel.attach();

    bus.listen('someProp', (sum: number) => (result += sum));
    client.broadcast({ someProp: 42 });

    await new Promise((r) => setTimeout(r, 200));
    t.equal(result, 50);
    t.end();
});
