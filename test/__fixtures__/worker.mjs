import { workerData } from 'worker_threads';
import Channel from '../../src/worker_threads';

const ch = new Channel(workerData.channel, {});
const client = ch.attach();

client.broadcast({ onCalc: workerData.add });
