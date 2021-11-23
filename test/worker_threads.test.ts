import path from 'path';
import url from 'url';
import { Worker } from 'worker_threads';

import { test } from 'tap';

import Channel from '../src/worker_threads';

interface Payload {
    someProp?: number
}
const defaultValue = {
    someProp: 5
};

const EXPECTED_SUM = 15;

// eslint-disable-next-line
// @ts-ignore VSCode has problems detecting ESM here
const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const workerPath = path.join(dirname, '__fixtures__', 'worker.mjs');
const argv = [
    '--loader=ts-node/esm',
    '--experimental-specifier-resolution=node'
];

test('should allow communication between multiple worker threads', (t) => {
    t.plan(1);

    const ch = new Channel<Payload>('test1', defaultValue);
    ch.register([
        new Worker(workerPath, { argv, workerData: { channel: 'test1', add: 1 } }),
        new Worker(workerPath, { argv, workerData: { channel: 'test1', add: 3 } }),
        new Worker(workerPath, { argv, workerData: { channel: 'test1', add: 6 } })
    ]).subscribe((bus) => {
        let result = 0;

        bus.listen('someProp', (sum: number) => {
            result += sum;

            if (result === EXPECTED_SUM) {
                t.equal(result, EXPECTED_SUM);
                ch.providers.map((p) => p.terminate());
                t.end();
            }
        });
    });
});

test('should get bus by promise', async (t) => {
    t.plan(1);

    const ch = new Channel<Payload>('test2', defaultValue);
    const bus = await ch.registerPromise([
        new Worker(workerPath, { argv, workerData: { channel: 'test2', add: 1 } }),
        new Worker(workerPath, { argv, workerData: { channel: 'test2', add: 3 } }),
        new Worker(workerPath, { argv, workerData: { channel: 'test2', add: 6 } })
    ]);

    let result = 0;
    await new Promise<void>((resolve) => {
        bus.listen('someProp', (sum: number) => {
            result += sum;
            if (result === EXPECTED_SUM) {
                resolve();
            }
        });
    });


    t.equal(result, EXPECTED_SUM);
    ch.providers.map((p) => p.terminate());
});
