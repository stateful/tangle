import Channel from '/dist/webworkers.js';

const ch = new Channel('webWorker', {});

const client = ch.attach();

/**
 * get id of worker from url get params
 */
var url = new URL(self.location.href);
var id = url.searchParams.get('id');

/**
 * listen to events from other iframes
 */
client.listen('onCustomEvent', (msg) =>
    console.log(`Another message received in ${id}; ${msg}`));

/**
 * broadcast to all
 */
client.broadcast({ onCustomEvent: `Hello from ${id} 👋` });
