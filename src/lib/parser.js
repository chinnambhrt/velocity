
const { Writable } = require('stream');
const Client = require('./client');
const responses = require('./responses');

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

        this.state = client._state;

    }


    /**
     * 
     * @param {Buffer} chunk 
     * @param {string} encoding 
     * @param {Function} callback 
     */
    _write(chunk, encoding, finish) {

        if (!chunk || !chunk.length) return finish();

        if (this.state.tls.isUpgrading) return finish();

        let once = false;

        const next = () => {
            if (!once) {
                once = true;
                finish();
            }

            return;
        }

        if (this.state.dataMode) {

            this._processDataMode(chunk, next);

        } else {

            this._logger.debug("C:", chunk.toString().trim());

            const inputs = chunk.toString().trim().split(/\r?\n/g);

            if (inputs.length > 1) {

                let processed = 0;

                for (const input of inputs) {

                    if (input === "") {
                        processed++;
                        continue;
                    }

                    this.onCommand(input, () => {

                        processed++;

                        if (processed === inputs.length) {
                            next();
                        }
                    });

                }

            }
            else {

                const commandString = chunk.toString().trim();

                this._client.onCommand(commandString, next);

            }


        }



    }


    /**
     * 
     * @param {Buffer} chunk 
     * @param {Function} callback 
     */
    _processDataMode(chunk, callback) {

        // this._logger.debug("Data:", chunk.toString());

        if (chunk.length <= 3 && chunk.toString().trim() === ".") {

            // data mode has ended
            this._client.endDataMode();

            // this._client.useResponse(responses.DATA.DATA_MAIL_ACCEPTED);

            return callback();
        }

        const endSequence = Buffer.from("\r\n.\r\n", 'binary');

        const endIndex = chunk.indexOf(endSequence);

        if (endIndex > -1) {

            const lastBytes = chunk.subarray(0, endIndex);

            const remainder = chunk.subarray(endIndex + endSequence.length);

            // proceed to add the data stream
            // if successfully added then we can end the data mode
            // and send the response to the client
            // process the remainder if there is any left
            if (this._addDataStream(lastBytes)) {

                this._client.endDataMode();

                // if there is any data left in the remainder
                if (remainder.length > 0) {

                    return this._write(remainder, 'binary', callback);

                }
                else {
                    return callback();
                }

            } else {

                // if the data is not added successfully
                // then we should end the data mode and return
                this._logger.info('S: Data exceeds max size allowed / expected');

                return callback();

            }


        }

        // result doesn't matter, we're gonna 
        // unpause the data stream anyway
        this._addDataStream(chunk);

        callback();

    }

    /**
     * 
     * @param {Buffer} chunk 
     * @returns {boolean} returns true if the data stream is added successfully
     */
    _addDataStream(chunk) {

        const expectedSize = this.state.mail.expectedSize;

        const chunkSize = chunk.length;

        const nextSize = this.state.mail.data.length + chunkSize;

        // check if the data size is greater than the max email size allowed by the server
        // if it is then we should not accept the data and return false
        // indicating that the data is not added successfully
        if (nextSize > this._client._config.maxEmailSize) {
            this._client.endDataMode(new Error('EXCEEDS_MAX_SIZE'));
            return false;
        }

        // pperform the validation only if the expected size is greater than 0
        // grater than 0 means that the client has sent the size of the data
        // in the mail command and we are expecting the data to be of that size
        if (expectedSize > 0 && nextSize > expectedSize) {
            this._client.endDataMode(new Error('EXCEEDS_MAX_SIZE'));
            return false;
        }

        this.state.mail.data = Buffer.concat([this.state.mail.data, chunk]);

        return true;

    }


};

module.exports = VelocityParser;