import { URL } from 'url';
import { Worker, isMainThread, workerData } from 'worker_threads';
import Channel from '../dist/worker_threads.js';

const filename = new URL('', import.meta.url).pathname;

const ch = new Channel('test', {});

if (isMainThread) {
    ch.register([
        new Worker(filename, { workerData: { id: 'worker #1' } }),
        new Worker(filename, { workerData: { id: 'worker #2' } }),
        new Worker(filename, { workerData: { id: 'worker #3' } })
    ]).subscribe((bus) => {
        bus.listen('onCustomEvent', (msg) => {
            console.log('Received from worker thread:', msg);
            bus.broadcast({ onCustomWorkerEvent: 'worker #3' });
        });

        bus.listen('onExit', () => {
            console.log('Bye bye');
            ch.providers.map((p) => p.terminate());
        });
    });
} else {
    const client = ch.attach('test', {});

    client.broadcast({ onCustomEvent: `Hello from ${workerData.id} 👋` });
    client.listen('onCustomWorkerEvent', (id) => {
        if (workerData.id === id) {
            client.broadcast({ 'onExit': workerData.id });
            process.exit(0);
        }
    });
}
