
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

        this.state = client._state;

    }


    /**
     * 
     * @param {Buffer} chunk 
     * @param {string} encoding 
     * @param {Function} callback 
     */
    _write(chunk, encoding, finish) {

        let once = false;

        const next = () => {
            if (!once) {
                once = true;
                finish();
            }

            return;
        }

        if (this.state.dataMode) {

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


};

module.exports = VelocityParser;