
const Client = require('../lib/client');

/**
 * 
 * @param {Client} client 
 * @param {string} request 
 * @param {Function} callback 
 */
module.exports = (client, request, callback) => {

    client._state.reset();

    client.sendResponse(250, 'OK');

    callback();

};