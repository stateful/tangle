import tap from 'tap';
import { Observable } from 'rxjs';

import { Bus } from '../src/tangle';

interface Payload {
    foo: number
    bar: number
    [key: number | symbol]: number
}

tap.test('has a transient getter', (t) => {
    const bus = new Bus<Payload>('testing', [], {} as Payload);
    t.ok(bus.transient instanceof Observable);
    t.end();
});

tap.test('allows to get state value', (t) => {
    const bus = new Bus<Payload>('testing', [], { foo: 0, bar: 0 } as Payload);
    t.matchSnapshot(bus.state);
    t.end();
});

tap.test('has a list if event names', (t) => {
    const noop = () => { /** */ };
    const bus = new Bus<Payload>('testing', [], {} as Payload);
    bus.on('foo', noop);
    bus.on('bar', noop);

    const sym = Symbol('symbol');
    bus.on(sym, noop);
    t.matchSnapshot(bus.eventNames());
    t.end();
});

tap.test('allows to get listener count', (t) => {
    const noop = () => { /** */ };
    const bus = new Bus<Payload>('testing', [], {} as Payload);
    bus.on('foo', noop);
    bus.on('foo', noop);
    bus.on('foo', noop);
    bus.on('bar', noop);

    const sym = Symbol('symbol');
    bus.on(sym, noop);
    bus.on(sym, noop);
    t.equal(bus.listenerCount('foo'), 3);
    t.equal(bus.listenerCount('bar'), 1);
    t.equal(bus.listenerCount(sym), 2);
    // @ts-expect-error wrong key
    t.equal(bus.listenerCount('foobar'), 0);
    t.end();
});

tap.test('allows to get listeners of certain event', (t) => {
    const noop = () => { /** */ };
    const bus = new Bus<Payload>('testing', [], {} as Payload);
    bus.on('foo', noop);
    const fn = bus.listeners('foo')[0];

    t.equal(fn, noop);
    t.end();
});
