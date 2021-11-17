import path from 'path';
import url from 'url';
import { Worker } from 'worker_threads';

import { test } from 'tap';

import Channel from '../src/worker_threads';

interface Payload {
    onCalc?: number
}

// eslint-disable-next-line
// @ts-ignore VSCode has problems detecting ESM here
const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const workerPath = path.join(dirname, '__fixtures__', 'worker.mjs');
const argv = [
    '--loader=ts-node/esm',
    '--experimental-specifier-resolution=node'
];

test('should allow communication between multiple worker threads', async (t) => {
    const ch = new Channel<Payload>('test1', {});
    ch.register([
        new Worker(workerPath, { argv, workerData: { channel: 'test1', add: 1 } }),
        new Worker(workerPath, { argv, workerData: { channel: 'test1', add: 3 } }),
        new Worker(workerPath, { argv, workerData: { channel: 'test1', add: 6 } })
    ]).subscribe((bus) => {
        let result = 0;

        bus.listen('onCalc', (sum: number) => {
            result += sum;

            if (result === 10) {
                ch.providers.map((p) => p.terminate());
                t.end();
            }
        });
    });
});

test('should get bus by promise', async (t) => {
    const ch = new Channel<Payload>('test2', {});
    const bus = await ch.registerPromise([
        new Worker(workerPath, { argv, workerData: { channel: 'test2', add: 1 } }),
        new Worker(workerPath, { argv, workerData: { channel: 'test2', add: 3 } }),
        new Worker(workerPath, { argv, workerData: { channel: 'test2', add: 6 } })
    ]);

    let result = 0;

    bus.listen('onCalc', (sum: number) => {
        result += sum;

        if (result === 10) {
            ch.providers.map((p) => p.terminate());
            t.end();
        }
    });
});
