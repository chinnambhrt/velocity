
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

    if (!state.mail.from) {
        client.useResponse(responses.RCPT.RCPT_MAIL_REQUIRED);
        return callback();
    }

    if (['fail', 'softfail', 'none'].includes(state.spfResult)) {
        client._logger.warn('SPF validation failed; disconnecting')
        client.useResponse(responses.SERVICE_NOT_AVAILABLE);
        client.disconnect();
        return callback();
    }

    const parsed = utils.fetchAddress(request);

    if (!parsed || !parsed.email) {
        client.useResponse(responses.RCPT.RCPT_INVALID_SYNTAX);
        return callback();
    }

    // find the from domain of the email
    const fromDomain = state.mail.from.split('@')[1].toLowerCase();

    // check the domain where the user want to send the email
    // to
    const toDomain = parsed.email.split('@')[1].toLowerCase();

    // if any of the domain is not the same domain
    // as the server domain, then we should not relay the email
    if (![fromDomain, toDomain].includes(client._config.emailDomain)) {
        client.useResponse(responses.RCPT.NO_RELAYING);
        return callback();
    }

    // everything is fine, add the recipient
    // send the success response
    state.mail.recipients.push(parsed.email);

    client.useResponse(responses.RCPT.RCPT_OK);

    callback();

};