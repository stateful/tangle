import { workerData } from 'worker_threads';
import Channel from '../../dist/esm/worker_threads.js';

const ch = new Channel(workerData.channel, {});
const client = ch.attach();

let result = 0;
function operation (sum) {
    result += sum;

    if (sum === 5) {
        client.off('add', operation);
    }
}

client.on('add', operation);
client.on('getResult', () => client.emit('result', result));
