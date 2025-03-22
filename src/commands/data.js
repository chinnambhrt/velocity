
const Client = require('../lib/client');
const responses = require('../lib/responses');

/**
 * 
 * @param {Client} client 
 * @param {string} request 
 * @param {Function} callback 
 */
module.exports = (client, _, callback) => {

    const state = client._state;

    
    // require mail command
    if (!state.mail.from) {
        client.useResponse(responses.RCPT.RCPT_MAIL_REQUIRED);
        return callback();
    }

    // require at least one recipient
    if (state.mail.recipients.length > 0) {
        client.useResponse(responses.RCPT.RCPT_RCPT_REQUIRED);
        return callback();
    }

    state.dataMode = true;

    client.useResponse(responses.DATA.DATA_START_INPUT);

    callback();

};