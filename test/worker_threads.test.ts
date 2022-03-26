import path from 'path';
import url from 'url';
import { Worker } from 'worker_threads';

import { test } from 'tap';

import Channel from '../src/worker_threads';
import { bufferCount, delay, from, timer } from 'rxjs';

interface Payload {
    someProp?: number
    action?: { method: string, args: any[] }
}
const defaultValue = {
    someProp: 5,
    action: { method: 'noop', args: [] }
};

const EXPECTED_SUM = 15;

// eslint-disable-next-line
// @ts-ignore VSCode has problems detecting ESM here
const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const workerPath = path.join(dirname, '__fixtures__', 'worker.mjs');
const workerOncePath = path.join(dirname, '__fixtures__', 'worker.once.mjs');
const workerOffPath = path.join(dirname, '__fixtures__', 'worker.off.mjs');
const workerUnsubscribePath = path.join(dirname, '__fixtures__', 'worker.unsubscribe.mjs');
const workerRemoveAllListenerPath = path.join(dirname, '__fixtures__', 'worker.removeAllListeners.mjs');
const argv = [
    '--loader=ts-node/esm',
    '--experimental-specifier-resolution=node'
];

// test('should allow communication between multiple worker threads', (t) => {
//     const namespace = 'test1';

//     const ch = new Channel<Payload>(namespace, defaultValue);
//     ch.register([
//         new Worker(workerPath, { argv, workerData: { channel: namespace, add: 1 } }),
//         new Worker(workerPath, { argv, workerData: { channel: namespace, add: 3 } }),
//         new Worker(workerPath, { argv, workerData: { channel: namespace, add: 6 } })
//     ]).subscribe((bus) => {
//         let result = 0;

//         bus.listen('someProp', (sum?: number) => {
//             result += sum || 0;

//             if (result === EXPECTED_SUM) {
//                 t.equal(result, EXPECTED_SUM);
//                 ch.providers.map((p) => p.terminate());
//                 t.end();
//             }
//         });
//     });
// });

// test('should get bus by promise', async (t) => {
//     const namespace = 'test1';

//     const ch = new Channel<Payload>(namespace, defaultValue);
//     const bus = await ch.registerPromise([
//         new Worker(workerPath, { argv, workerData: { channel: namespace, add: 1 } }),
//         new Worker(workerPath, { argv, workerData: { channel: namespace, add: 3 } }),
//         new Worker(workerPath, { argv, workerData: { channel: namespace, add: 6 } })
//     ]);

//     let result = 0;
//     await new Promise<void>((resolve) => {
//         bus.listen('someProp', (sum?: number) => {
//             result += sum || 0;
//             if (result === EXPECTED_SUM) {
//                 resolve();
//             }
//         });
//     });


//     t.equal(result, EXPECTED_SUM);
//     ch.providers.map((p) => p.terminate());
//     t.end();
// });

// test('should allow to send events', async (t) => {
//     const namespace = 'test3';

//     const ch = new Channel<{ onFoobar: number }>(namespace, { onFoobar: 0 });
//     const providers = [
//         new Worker(workerPath, { argv, workerData: { channel: namespace, event: 1 } }),
//         new Worker(workerPath, { argv, workerData: { channel: namespace, event: 3 } }),
//         new Worker(workerPath, { argv, workerData: { channel: namespace, event: 6 } })
//     ];
//     const bus = await ch.registerPromise(providers);

//     let result = 0;
//     await new Promise<void>((resolve) => {
//         bus.on('onFoobar', (sum: number) => {
//             result += sum;
//             if (result === 10) {
//                 resolve();
//             }
//         });
//     });


//     t.equal(result, 10);
//     ch.providers.map((p) => p.terminate());
//     t.end();
// });

test('should allow to listen once', async (t) => {
    const namespace = 'test4';

    const ch = new Channel<any>(namespace);
    const bus = await ch.registerPromise([
        new Worker(workerOncePath, { argv, workerData: { channel: namespace } }),
    ]);

    bus.emit('add', 2);
    bus.emit('add', 5);
    bus.emit('add', 15);
    bus.emit('getResult', {});
    const result = await new Promise<number>(
        (resolve) => bus.on('result', resolve));

    t.equal(result, 2);
    ch.providers.map((p) => p.terminate());
    t.end();
});

// test('should allow to unsubscribe via off', async (t) => {
//     const namespace = 'test5';

//     const ch = new Channel<any>(namespace);
//     const bus = await ch.registerPromise([
//         new Worker(workerOffPath, { argv, workerData: { channel: namespace } }),
//     ]);

//     bus.emit('add', 2);
//     bus.emit('add', 5);
//     bus.emit('add', 15);
//     bus.emit('getResult', {});
//     const result = await new Promise<number>(
//         (resolve) => bus.on('result', resolve));

//     t.equal(result, 7);
//     ch.providers.map((p) => p.terminate());
//     t.end();
// });

// test('should allow to unsubscribe via unsubscribe', async (t) => {
//     const namespace = 'test5';

//     const ch = new Channel<any>(namespace);
//     const bus = await ch.registerPromise([
//         new Worker(workerUnsubscribePath, { argv, workerData: { channel: namespace } }),
//     ]);

//     bus.emit('add', 2);
//     bus.emit('add', 5);
//     bus.emit('add', 15);
//     bus.emit('getResult', {});
//     const result = await new Promise<number>(
//         (resolve) => bus.on('result', resolve));

//     t.equal(result, 7);
//     ch.providers.map((p) => p.terminate());
//     t.end();
// });

// test('should allow to unsubscribe', async (t) => {
//     const namespace = 'test6';

//     const ch = new Channel<any>(namespace);
//     const bus = await ch.registerPromise([
//         new Worker(workerRemoveAllListenerPath, { argv, workerData: { channel: namespace } }),
//     ]);

//     bus.emit('add', 2);
//     bus.emit('mul', 3);
//     bus.emit('off', {});
//     await new Promise((resolve) => setTimeout(resolve, 300));
//     bus.emit('add', 5);
//     bus.emit('mul', 2);
//     bus.emit('getResult', {});
//     const result = await new Promise<number>(
//         (resolve) => bus.on('result', resolve));

//     t.equal(result, 6);
//     ch.providers.map((p) => p.terminate());
//     t.end();
// });

// test('should allow to introspect context', (t) => {
//     const namespace = 'test7';

//     const ch = new Channel<Payload>(namespace, defaultValue);
//     const providers = [
//         new Worker(workerPath, { argv, workerData: { channel: namespace, expect: 1 } }),
//         new Worker(workerPath, { argv, workerData: { channel: namespace, expect: 3 } }),
//         new Worker(workerPath, { argv, workerData: { channel: namespace, expect: 6 } })
//     ];
//     const len = providers.length + 1;
//     ch.register(providers).subscribe((bus) => {
//         bus.context.pipe(bufferCount(len)).subscribe({
//             next: () => {
//                 console.log(len);
//                 from([1, 3, 6]).pipe(delay(500)).subscribe((e) => {
//                     bus.broadcast({ someProp: e, })
//                 })
//             }
//         });
//     });
// });
