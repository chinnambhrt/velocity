
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

    client.sendResponse(250, 'OK');

    callback();

};