import { expectType } from 'tsd';
import { Observable } from 'rxjs';
import { Bus, Context, Payload as PkgPayload } from '../src/tangle';
import IFrameChannel from '../src/iframes';
import WorkerThreadChannel from '../src/worker_threads';

type Payload = {
    foo: string
    bar: number
};
const defaultPayload = { foo: '', bar: 123 };

const bus = new Bus<Payload>(
    'namespace',
    [],
    {
        foo: '',
        bar: 123,
        // @ts-expect-error not part of state
        loo: true
    }
);

new WorkerThreadChannel<Payload>('namespace');
new WorkerThreadChannel<Payload>('namespace', defaultPayload);
new IFrameChannel<Payload>('namespace');
new IFrameChannel<Payload>('namespace', defaultPayload);
// @ts-expect-error missing property
new IFrameChannel<Payload>('namespace', { foo: '' });

bus.listen('foo', (param) => {
    expectType<string>(param);
});
bus.listen('bar', (param) => {
    expectType<number>(param);
});
// @ts-expect-error wrong key
bus.listen('foobar', () => null);
bus.broadcast({
    foo: 'foo',
    bar: 123,
    // @ts-expect-error not part of state
    loo: true
});

bus.emit('foo', 'foo');
// @ts-expect-error wrong payload
bus.emit('foo', 123);

bus.emit('bar', 123);
// @ts-expect-error wrong payload
bus.emit('bar', 'bar');

bus.on('foo', (param) => {
    expectType<string>(param);
});
bus.on('bar', (param) => {
    expectType<number>(param);
});

bus.once('foo', (param) => {
    expectType<string>(param);
});
bus.once('bar', (param) => {
    expectType<number>(param);
});

bus.off('foo', (param) => {
    expectType<string>(param);
});
bus.off('bar', (param) => {
    expectType<number>(param);
});

bus.readyPromise().then((ctx) => {
    expectType<Context>(ctx);
});

expectType<(keyof Payload)[]>(bus.eventNames());
bus.listenerCount('foo');
bus.listenerCount('bar');
// @ts-expect-error wrong key
bus.listenerCount('loo');

bus.removeAllListeners();

expectType<Observable<PkgPayload<Payload>>>(bus.events);
expectType<Observable<Payload>>(bus.transient);
expectType<Observable<Context>>(bus.context);
expectType<Payload>(bus.state);
