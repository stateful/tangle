import { expectType } from 'tsd';
import { Observable } from 'rxjs';
import { Bus, Payload as PkgPayload } from '../src/tangle';

type Payload = {
    foo: string
    bar: number
};

const bus = new Bus<Payload>(
    'namespace',
    {
        foo: '',
        bar: 123,
        // @ts-expect-error not part of state
        loo: true
    },
    []
);

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

expectType<(keyof Payload)[]>(bus.eventNames());
bus.listenerCount('foo');
bus.listenerCount('bar');
// @ts-expect-error wrong key
bus.listenerCount('loo');

bus.removeAllListeners();

expectType<Observable<PkgPayload<Payload>>>(bus.events);
expectType<Observable<Payload>>(bus.transient);
expectType<Payload>(bus.state);
