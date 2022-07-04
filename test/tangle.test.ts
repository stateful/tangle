import { test, expect } from 'vitest';
import { Observable } from 'rxjs';

import { Bus } from '../src/tangle';

interface Payload {
    foo: number
    bar: number
    [key: number | symbol]: number
}

test('has a transient getter', () => {
    const bus = new Bus<Payload>('testing', [], {} as Payload);
    expect(bus.transient instanceof Observable).toBe(true);
});

test('allows to get state value', () => {
    const bus = new Bus<Payload>('testing', [], { foo: 0, bar: 0 } as Payload);
    expect(bus.state).toMatchSnapshot();
});

test('has a list if event names', () => {
    const noop = () => { /** */ };
    const bus = new Bus<Payload>('testing', [], {} as Payload);
    bus.on('foo', noop);
    bus.on('bar', noop);

    const sym = Symbol('symbol');
    bus.on(sym, noop);
    expect(bus.eventNames()).toMatchSnapshot();
});

test('allows to get listener count', () => {
    const noop = () => { /** */ };
    const bus = new Bus<Payload>('testing', [], {} as Payload);
    bus.on('foo', noop);
    bus.on('foo', noop);
    bus.on('foo', noop);
    bus.on('bar', noop);

    const sym = Symbol('symbol');
    bus.on(sym, noop);
    bus.on(sym, noop);
    expect(bus.listenerCount('foo')).toBe(3);
    expect(bus.listenerCount('bar')).toBe(1);
    expect(bus.listenerCount(sym)).toBe(2);
    // @ts-expect-error wrong key
    expect(bus.listenerCount('foobar')).toBe(0);
});

test('allows to get listeners of certain event', () => {
    const noop = () => { /** */ };
    const bus = new Bus<Payload>('testing', [], {} as Payload);
    bus.on('foo', noop);
    const fn = bus.listeners('foo')[0];

    expect(fn).toEqual(noop);
});
