import { workerData } from 'worker_threads';
import Channel from '../../src/worker_threads';

const ch = new Channel(workerData.channel, {});
const client = ch.attach();

/**
 * listen to events within the same sandbox
 */
let result = 0;
client.once('add', (sum) => (result += sum));
client.addListener('getResult', () => client.emit('result', result));
