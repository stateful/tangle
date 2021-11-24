import tap from 'tap';
import { Observable } from 'rxjs';

import { Bus } from '../src/tangle';

const sym1 = Symbol('');
interface Payload {
    foo: number
    bar: number
    [key: number | symbol]: number
}

const defaultPayload: Payload = {
    foo: 0,
    bar: 0,
    [sym1]: 0
};

tap.test('has a transient getter', (t) => {
    const bus = new Bus<Payload>("testing", defaultPayload, []);
    t.ok(bus.transient instanceof Observable);
    t.end();
});

tap.test('allows to get state value', (t) => {
    const bus = new Bus<Payload>("testing", defaultPayload, []);
    t.matchSnapshot(bus.state);
    t.end();
});

tap.test('has a list if event names', (t) => {
    const noop = () => { /** */ };
    const bus = new Bus<Payload>("testing", defaultPayload, []);
    bus.on('foo', noop);
    bus.on('bar', noop);

    const sym = Symbol('symbol');
    bus.on(sym, noop);
    t.matchSnapshot(bus.eventNames());
    t.end();
});

tap.test('allows to get listener count', (t) => {
    const noop = () => { /** */ };
    const bus = new Bus<Payload>("testing", defaultPayload, []);
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
    const bus = new Bus<Payload>("testing", defaultPayload, []);
    bus.on('foo', noop);
    const fn = bus.listeners('foo')[0];

    t.equal(fn, noop);
    t.end();
});
