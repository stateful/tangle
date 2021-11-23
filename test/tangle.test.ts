import tap from 'tap';
import { Observable } from 'rxjs';

import { Bus } from '../src/tangle';

tap.test('has a transient getter', (t) => {
    const bus = new Bus<object>("testing", {}, []);
    t.ok(bus.transient instanceof Observable);
    t.end();
});

tap.test('allows to get state value', (t) => {
    const state = { foo: 'bar' };
    const bus = new Bus<object>("testing", state, []);
    t.matchSnapshot(bus.state);
    t.end();
});

tap.test('has a list if event names', (t) => {
    const noop = () => { /** */ };
    const bus = new Bus<object>("testing", {}, []);
    bus.on('foo', noop);
    bus.on('bar', noop);

    const sym = Symbol('symbol');
    bus.on(sym, noop);
    t.matchSnapshot(bus.eventNames());
    t.end();
});

tap.test('allows to get listener count', (t) => {
    const noop = () => { /** */ };
    const bus = new Bus<object>("testing", {}, []);
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
    t.equal(bus.listenerCount('foobar'), 0);
    t.end();
});

tap.test('allows to get listeners of certain event', (t) => {
    const noop = () => { /** */ };
    const bus = new Bus<object>("testing", {}, []);
    bus.on('foo', noop);
    const fn = bus.listeners('foo')[0];

    t.equal(fn, noop);
    t.end();
});
