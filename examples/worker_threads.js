import { URL } from 'url';
import { Worker, isMainThread, workerData } from 'worker_threads';
import Channel from '../dist/esm/worker_threads.js';

const filename = new URL('', import.meta.url).pathname;

const ch = new Channel('test', {});

if (isMainThread) {
    const bus = await ch.registerPromise([
        new Worker(filename, { workerData: { id: 'worker #1' } }),
        // new Worker(filename, { workerData: { id: 'worker #2' } }),
        // new Worker(filename, { workerData: { id: 'worker #3' } })
    ]);

    bus.emit('add', 2);
    bus.emit('add', 5);
    bus.emit('add', 15);
    bus.emit('getResult');
    bus.on('result', (result) => console.log(123, result));
} else {
    const client = ch.attach();

    /**
     * listen to events within the same sandbox
     */
    let result = 0;
    client.once('add', (sum) => (result += sum));
    client.on('getResult', () => client.emit('result', result));
}
