
const Client = require('../lib/client');
const responses = require('../lib/responses');
const utils = require('../utils/command.utils');

/**
 * 
 * @param {Client} client 
 * @param {string} request 
 * @param {Function} callback 
 */
module.exports = (client, request, callback) => {

    const state = client._state;

    if(!state.mail.from) {
        client.useResponse(responses.RCPT.RCPT_MAIL_REQUIRED);
        return callback();
    }

    const parsed = utils.fetchAddress(request);

    if(!parsed || !parsed.email) {
        client.useResponse(responses.RCPT.RCPT_INVALID_SYNTAX);
        return callback();
    }

    state.mail.recipients.push(parsed.email);

    client.useResponse(responses.RCPT.RCPT_OK);

    callback();

};