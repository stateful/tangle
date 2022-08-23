import { workerData } from 'worker_threads';
import Channel from '../../dist/esm/worker_threads.js';

const ch = new Channel(workerData.channel, {});
const client = ch.attach();

if (workerData.add) {
    client.broadcast({ someProp: workerData.add });
}

if (workerData.event) {
    setTimeout(() => {
        client.emit('onFoobar', workerData.event);
    }, 1000);
}
