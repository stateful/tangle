import { URL } from 'url';
import { Worker, isMainThread, workerData } from 'worker_threads';
import Channel from '../dist/worker_threads.js';

const filename = new URL('', import.meta.url).pathname;

const ch = new Channel('test', {});

if (isMainThread) {
    const bus = await ch.registerPromise([
        new Worker(filename, { workerData: { id: 'worker #1' } }),
        new Worker(filename, { workerData: { id: 'worker #2' } }),
        new Worker(filename, { workerData: { id: 'worker #3' } })
    ]);

    bus.listen('onCustomEvent', (msg) =>
        console.log('Received from worker thread:', msg));

    bus.listen('onExit', () => {
        console.log('Bye bye');
        ch.providers.map((p) => p.terminate());
    });

    setTimeout(() => bus.broadcast({ onCustomWorkerEvent: 'worker #3' }), 100);
} else {
    const client = ch.attach('test', {});

    /**
     * listen to events within the same sandbox
     */
    client.listen('onCustomEvent', (msg) =>
        console.log(`Another worker message received in ${workerData.id}; ${msg}`));

    /**
     * broadcast to all
     */
    client.broadcast({ onCustomEvent: `Hello from ${workerData.id} 👋` });

    /**
     * listen to messages from message bus
     */
    client.listen('onCustomWorkerEvent', (id) => {
        if (workerData.id === id) {
            client.broadcast({ 'onExit': workerData.id });
        }
    });
}
