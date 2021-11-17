import path from 'path';
import url from 'url';
import { Worker } from 'worker_threads';

import tap from 'tap';

import Channel from '../src/worker_threads';

interface Payload {
    onCalc?: number
}

// eslint-disable-next-line
// @ts-ignore VSCode has problems detecting ESM here
const dirname = path.dirname(url.fileURLToPath(import.meta.url));

tap.test('should allow communication between multiple worker threads', async () => {
    const workerPath = path.join(dirname, '__fixtures__', 'worker.mjs');
    const ch = new Channel<Payload>('test', {});
    const argv = [
        '--loader=ts-node/esm',
        '--experimental-specifier-resolution=node'
    ];
    ch.register([
        new Worker(workerPath, { argv, workerData: { add: 1 } }),
        new Worker(workerPath, { argv, workerData: { add: 3 } }),
        new Worker(workerPath, { argv, workerData: { add: 6 } })
    ]).subscribe((bus) => {
        let result = 0;

        bus.listen('onCalc', (sum: number) => {
            result += sum;

            if (result === 10) {
                ch.providers.map((p) => p.terminate());
                tap.end();
            }
        });
    });
});
