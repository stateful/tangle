import { workerData } from 'worker_threads';
import Channel from '../../dist/esm/worker_threads.js';

const ch = new Channel(workerData.channel, {});
const client = ch.attach();

/**
 * listen to events within the same sandbox
 */
let result = 0;
client.once('add', (sum) => (result += sum));
client.on('getResult', () => client.emit('result', result));
