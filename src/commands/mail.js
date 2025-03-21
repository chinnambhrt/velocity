
const Client = require('../lib/client');
const responses = require('../lib/responses');
const commandUtils = require('../utils/command.utils');

/**
 * 
 * @param {Client} client 
 * @param {string} request 
 * @param {Function} callback 
 */
module.exports = (client, request, callback) => {

    const state = client._state;

    if (!state.ready) {
        client.useResponse(responses.HELLO.HELLO_REQUIRED);
        return callback();
    }

    const parsed = commandUtils.fetchAddress(request);

    if (!parsed || !parsed.email) {
        client.useResponse(responses.MAIL.MAIL_INVALID_SYNTAX);
        return callback();
    }

    client._logger.debug(`Parsed command: ${JSON.stringify(parsed)}`);

    state.mail.from = parsed.email;

    state.mail.expectedSize = Number(parsed.args.SIZE) || -1;

    client.sendResponse(250, 'OK');

    callback();

};