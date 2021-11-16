import tap from 'tap';
import { EventEmitter } from 'events';

import { forDOM } from '../src/vrx';
import { Messenger, Receiver } from '../src/types';


const eventEmitter = new EventEmitter();
const receiver: Receiver = {
    addEventListener: (type: string, cb: (evt: Event) => void) => eventEmitter.on(type, cb)
};
const messenger: Messenger = {
    postMessage: (message: any) => eventEmitter.emit('message', message)
};

const sleep = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

interface Payload {
    onFoo?: string
}

tap.test('client with simple event emitter', async (t) => {
    const clientA = forDOM<Payload>('test1', receiver, messenger, {});
    const clientB = forDOM<Payload>('test1', receiver, messenger, {});
    let result = '';
    clientA.listen('onFoo', (data: string) => (result = data));
    clientB.broadcast({ onFoo: 'bar' });
    await sleep();
    t.equal(result, 'bar');
    t.end();
});

tap.test('should not receive messages if client is in different namespace', async (t) => {
    const clientA = forDOM<Payload>('test1', receiver, messenger, {});
    const clientB = forDOM<Payload>('test2', receiver, messenger, {});
    let result = '';
    clientA.listen('onFoo', (data: string) => (result = data));
    clientB.broadcast({ onFoo: 'bar' });
    await sleep();
    t.equal(result, '');
    t.end();
});