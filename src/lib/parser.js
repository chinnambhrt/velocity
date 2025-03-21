
const { Writable } = require('stream');
const Client = require('./client');

class VelocityParser extends Writable {

    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {

        super();

        this._client = client;

        this._socket = client.socket;

        this._logger = client._logger;

    }


    /**
     * 
     * @param {Buffer} chunk 
     * @param {string} encoding 
     * @param {Function} callback 
     */
    _write(chunk, encoding, callback) {

        const message = chunk.toString();

        this._logger.debug('Received message:', message);

        callback();
    }


};

module.exports = VelocityParser;