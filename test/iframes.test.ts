import { JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';
import { test } from 'tap';

import Channel from '../src/iframes';

interface Payload {
    onCalc?: number
}

test('should allow communication between multiple worker threads', async (t) => {
    t.plan(1);
    const resourceLoader = new ResourceLoader({
        proxy: "http://127.0.0.1:8080",
        strictSSL: false
    });
    const virtualConsole = new VirtualConsole();
    virtualConsole.sendTo(console);
    const dom = new JSDOM(``, {
        runScripts: 'outside-only',
        resources: resourceLoader,
        virtualConsole
    });

    const { window } = dom;
    const frame = window.document.createElement('iframe');
    window.document.body.appendChild(frame);

    const frameChannel = new Channel<Payload>('iframe', {}, window as any);
    const iframeChannel = new Channel<Payload>('iframe', {}, frame.contentWindow as any);

    let result = 0;
    const bus = await frameChannel.registerPromise([frame]);
    const client = iframeChannel.attach();

    bus.listen('onCalc', (sum: number) => (result += sum));
    client.broadcast({ onCalc: 42 });

    await new Promise((r) => setTimeout(r, 200));
    t.equal(result, 42);
});
