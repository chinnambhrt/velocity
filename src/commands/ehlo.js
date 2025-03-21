
const Client = require('../lib/client');
const responses = require('../lib/responses');

/**
 * 
 * @param {Client} client 
 * @param {string} request 
 * @param {Function} callback 
 */
module.exports = (client, request, callback) => {

    const state = client._state;

    const [command, ...args] = request.split(/\s+/g);

    if (!args[0]) {
        client.useResponse(responses.HELLO.HELLO_INVALID_SYNTAX);
        return callback();
    }

    state.domainClaimed = args[0];

    state.ready = true;

    const capabilities = [];

    capabilities.push(`250-Hello ${args[0]}`);

    capabilities.push(`250-SIZE ${client._config.maxEmailSize}`);

    capabilities.push('250-PIPELINING');

    capabilities.push('250-ENHANCEDSTATUSCODES');

    // advertise starttls if supported
    if (client._config.capabilities.STARTTLS) {
        capabilities.push('250-STARTTLS');
    }

    capabilities.push('250-8BITMIME');

    capabilities.push('250 DSN');

    client.sendResponse(0, capabilities.join('\r\n'));

    callback();

}