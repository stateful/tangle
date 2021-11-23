import { workerData } from 'worker_threads';
import Channel from '../../src/worker_threads';

const ch = new Channel(workerData.channel, {});
const client = ch.attach();

/**
 * listen to events within the same sandbox
 */
let result = 0;
client.on('add', (sum) => (result += sum));
client.on('mul', (sum) => (result *= sum));
client.on('off', () => {
    client.removeAllListeners();
    client.on('getResult', () => client.emit('result', result));
});
client.on('getResult', () => client.emit('result', result));
