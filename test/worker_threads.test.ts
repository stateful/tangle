import {
    delay,
    last,
    lastValueFrom,
    map,
    mergeMap,
    Observable,
    of,
    scan,
    share,
    takeWhile,
    tap,
} from 'rxjs';
import path from 'path';
import url from 'url';
import { Worker } from 'worker_threads';

import { test, expect } from 'vitest';

import Channel from '../src/worker_threads';

interface Payload {
    someProp?: number
    action?: { method: string, args: any[] }
}
const defaultValue = {
    someProp: 5,
    action: { method: 'noop', args: [] }
};

const EXPECTED_SUM = 25;

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

test('should allow communication between multiple worker threads', () => {
    const namespace = 'test1';

    const ch = new Channel<Payload>(namespace, defaultValue);
    return new Promise<void>((resolve) => {
        ch.register([
            new Worker(workerPath, { argv, workerData: { channel: namespace, add: 1 } }),
            new Worker(workerPath, { argv, workerData: { channel: namespace, add: 3 } }),
            new Worker(workerPath, { argv, workerData: { channel: namespace, add: 6 } })
        ]).subscribe((bus) => {
            let result = 0;

            bus.listen('someProp', (sum?: number) => {
                result += sum || 0;

                if (result === EXPECTED_SUM) {
                    expect(result).toBe(EXPECTED_SUM);
                    ch.providers.map((p) => p.terminate());
                    resolve();
                }
            });
        });
    });
});

test('should get bus by promise', async () => {
    const namespace = 'test1';

    const ch = new Channel<Payload>(namespace, defaultValue);
    const bus = await ch.registerPromise([
        new Worker(workerPath, { argv, workerData: { channel: namespace, add: 1 } }),
        new Worker(workerPath, { argv, workerData: { channel: namespace, add: 3 } }),
        new Worker(workerPath, { argv, workerData: { channel: namespace, add: 6 } })
    ]);

    let result = 0;
    await new Promise<void>((resolve) => {
        bus.listen('someProp', (sum?: number) => {
            result += sum || 0;
            if (result === EXPECTED_SUM) {
                resolve();
            }
        });
    });


    expect(result).toBe(EXPECTED_SUM);
    ch.providers.map((p) => p.terminate());
});

test('does not emit if state has not changed', async () => {
    const namespace = 'test1';

    const ch = new Channel<Payload>(namespace, { someProp: 0 } as any);
    const bus = await ch.registerPromise([
        new Worker(workerPath, { argv, workerData: { channel: namespace, add: 1 } })
    ]);
    let result = 0;
    bus.listen('someProp', (sum?: number) => {
        result += sum || 0;
    });

    bus.broadcast({ someProp: 1 });
    bus.broadcast({ someProp: 1 });
    bus.broadcast({ someProp: 1 });
    bus.broadcast({ someProp: 1 });
    bus.broadcast({ someProp: 1 });
    bus.broadcast({ someProp: 1 });
    // implicitly wait to allow events to come in
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(result).toBe(1);
    ch.providers.map((p) => p.terminate());
});


test('should allow to send events', async () => {
    const namespace = 'test3';

    const ch = new Channel<{ onFoobar: number }>(namespace, { onFoobar: 0 });
    const bus = await ch.registerPromise([
        new Worker(workerPath, { argv, workerData: { channel: namespace, event: 1 } }),
        new Worker(workerPath, { argv, workerData: { channel: namespace, event: 3 } }),
        new Worker(workerPath, { argv, workerData: { channel: namespace, event: 6 } })
    ]);

    let result = 0;
    await new Promise<void>((resolve) => {
        bus.on('onFoobar', (sum: number) => {
            result += sum;
            if (result === 10) {
                resolve();
            }
        });
    });


    expect(result).toBe(10);
    ch.providers.map((p) => p.terminate());
});

test('should allow to listen once', async () => {
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

    expect(result).toBe(2);
    ch.providers.map((p) => p.terminate());
});

test('should allow to unsubscribe via off', async () => {
    const namespace = 'test5';

    const ch = new Channel<any>(namespace);
    const bus = await ch.registerPromise([
        new Worker(workerOffPath, { argv, workerData: { channel: namespace } }),
    ]);

    bus.emit('add', 2);
    bus.emit('add', 5);
    bus.emit('add', 15);
    bus.emit('getResult', {});
    const result = await new Promise<number>(
        (resolve) => bus.on('result', resolve));

    expect(result).toBe(7);
    ch.providers.map((p) => p.terminate());
});

test('should allow to unsubscribe via unsubscribe', async () => {
    const namespace = 'test5';

    const ch = new Channel<any>(namespace);
    const bus = await ch.registerPromise([
        new Worker(workerUnsubscribePath, { argv, workerData: { channel: namespace } }),
    ]);

    bus.emit('add', 2);
    bus.emit('add', 5);
    bus.emit('add', 15);
    bus.emit('getResult', {});
    const result = await new Promise<number>(
        (resolve) => bus.on('result', resolve));

    expect(result).toBe(7);
    ch.providers.map((p) => p.terminate());
});

test('should allow to unsubscribe', async () => {
    const namespace = 'test6';

    const ch = new Channel<any>(namespace);
    const bus = await ch.registerPromise([
        new Worker(workerRemoveAllListenerPath, { argv, workerData: { channel: namespace } }),
    ]);

    bus.emit('add', 2);
    bus.emit('mul', 3);
    bus.emit('off', {});
    await new Promise((resolve) => setTimeout(resolve, 300));
    bus.emit('add', 5);
    bus.emit('mul', 2);
    bus.emit('getResult', {});
    const result = await new Promise<number>(
        (resolve) => bus.on('result', resolve));

    expect(result).toBe(6);
    ch.providers.map((p) => p.terminate());
});

test('should wait until all parties have connected', async () => {
    const namespace = 'test7';

    const ch = new Channel<Payload>(namespace, defaultValue);
    const providers = [
        new Worker(workerPath, { argv, workerData: { channel: namespace, add: 1 } }),
        new Worker(workerPath, { argv, workerData: { channel: namespace, add: 3 } }),
        new Worker(workerPath, { argv, workerData: { channel: namespace, add: 6 } })
    ];
    const bus = await ch.registerPromise(providers);

    const ready = bus.whenReady();

    let result = 0;
    const tally = await new Promise<void>((resolve) => {
        bus.listen('someProp', (sum?: number) => {
            result += sum || 0;
            if (result === EXPECTED_SUM) {
                resolve();
            }
        });
    });
    expect(result).toBe(EXPECTED_SUM);

    const [context] = await Promise.all([ready, tally]);
    expect(context.clients.size).toBe(providers.length + 1); // +1 for bus

    ch.providers.map((p) => p.terminate());
});

test('should allow for async worker resolution', async () => {
    const namespace = 'test8';

    const ch = new Channel<{ onFoobar: number }>(namespace, { onFoobar: 0 });
    const providers$: Observable<Worker>[] = [
        of(
            new Worker(workerPath, {
                argv,
                workerData: { channel: namespace, event: 1 },
            })
        ),
        of(
            new Worker(workerPath, {
                argv,
                workerData: { channel: namespace, event: 3 },
            })
        ),
        of(
            new Worker(workerPath, {
                argv,
                workerData: { channel: namespace, event: 6 },
            })
        ).pipe(delay(1000)),
    ];

    const tally$ = ch.register(providers$).pipe(
        mergeMap((bus) => {
            return new Observable<number | undefined>((observer) => {
                bus.on('onFoobar', (num) => {
                    // console.log(`< ${num}`);
                    return observer.next(num);
                });
            });
        }),
        scan((acc, one) => {
            const num = one || 0;
            acc.push(num);
            return acc;
        }, <number[]>[]),
        share());

    const expectTally = (expected: number) => {
        return (source: Observable<number[]>) => {
            return source.pipe(
                takeWhile((numArr) => {
                    return numArr.reduce((sum, one) => sum + one, 0) < expected;
                }),
                last(),
                map(numArr => Array.from(numArr.values()).reduce((sum, one) => sum + one, 0)),
                tap(sum => {
                    // console.log(`= ${sum}`);
                    expect(sum).toBe(expected);
                })
            );
        };
    };

    const total$ = tally$.pipe(expectTally(10));

    await lastValueFrom(total$);
});
