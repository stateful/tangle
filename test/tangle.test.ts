import tap from 'tap';
import { Observable } from 'rxjs';

import { Bus } from '../src/tangle';

tap.test('has a transient getter', (t) => {
    const bus = new Bus<object>("testing", {}, []);
    t.ok(bus.transient instanceof Observable);
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
