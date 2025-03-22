
const Client = require('../lib/client');
const responses = require('../lib/responses');

/**
 * 
 * @param {Client} client 
 * @param {string} request 
 * @param {Function} callback 
 */
module.exports = (client, request, callback) => {

    const [_, email, ...rest] = request.split(/\s+/g);

    if (!email) {
        client.useResponse(responses.VRFY.VRFY_INVALID_SYNTAX);
        return callback();
    }

    client.useResponse(responses.VRFY.VRFY_OK);

};