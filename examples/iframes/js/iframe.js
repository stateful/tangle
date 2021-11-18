import Channel from '/dist/iframes.js';

const ch = new Channel('iframe', {});

const client = ch.attach();

/**
 * listen to events from other iframes
 */
client.listen('onCustomEvent', (msg) =>
    console.log(`Another iFrame message received in ${document.title}; ${msg}`));

/**
 * broadcast to all
 */
client.broadcast({ onCustomEvent: `Hello from ${document.title} 👋` });
