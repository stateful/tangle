import tap from 'tap';
import { Observable } from 'rxjs';

import { Bus } from '../src/vrx';

tap.test('has a transient getter', (t) => {
    const bus = new Bus<object>("testing", {}, []);
    t.ok(bus.transient instanceof Observable);
    t.end();
});