import { workerData } from 'worker_threads';
import Channel from '../../src/worker_threads';

const ch = new Channel(workerData.channel, {});
const client = ch.attach();

/**
 * listen to events within the same sandbox
 */
let result = 0;
const subscription = client.on('add', (sum) => {
    result += sum;

    if (sum === 5) {
        client.off(subscription);
    }
});
client.on('getResult', () => client.emit('result', result));
