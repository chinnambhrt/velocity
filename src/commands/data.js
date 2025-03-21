
const Client = require('../lib/client');

/**
 * 
 * @param {Client} client 
 * @param {string} request 
 * @param {Function} callback 
 */
module.exports = (client, request, callback) => {

    const state = client._state;

    const [command, ...args] = request.split(/\s+/g);

    state.dataMode = true;

    client.sendResponse(354, 'Start mail input; end with <CRLF>.<CRLF>');

    callback();

};