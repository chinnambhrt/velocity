
const net = require('net');

const tls = require('tls');

const Config = require('../config/config');

const Logger = require('../logger');

const Client = require('./client');
const MailObject = require('../types/mail-object');

class VelocityServer {

    /**
     * 
     * @param {Config} config 
     */
    constructor(config) {

        this._config = config;

        /**
         * Server instance
         * @type {net.Server | tls.Server | null}
         */
        this._server = null;

        this._logger = new Logger('_velocity_server_', {
            logLevel: this._config.logLevel
        });

        /**
         * Map of connected clients
         * @type {Map<String, Client>}
         */
        this._clients = new Map();


        // create the server instance
        this._createServer();

    }

    /**
     * Create the new server instance 
     */
    _createServer() {

        this._server = net.createServer(socket => this._addClient(socket));

    }

    /**
     * Initialize the client and add it to the list
     * @param {net.Socket} socket 
     */
    _addClient(socket) {

        if (this._clients.size >= this._config.maxConnections) {

            this._logger.error('Max connections reached, closing connection');

            socket.end('421 Ugh; one more, try again later\r\n');

            return;

        }

        const client = new Client(socket, this._config);

        
        this._clients.set(client._id, client);
        
        this._logger.info('Client connected', client._id);
        
        client.on('disconnected', (id) => this._removeClient(id));
        
        client.on('mail', (m) => this.onMailReceived(m));

        socket.write('220 Velocity server at your service\r\n');

    }

    /**
     * Remove the client from the list
     * @param {string} id 
     */
    _removeClient(id) {

        if (this._clients.delete(id)) {

            this._logger.info('Client disconnected', id);

        } else {

            this._logger.error('Client not found', id);

        }

    }

    /**
     * Start the server
     */
    start() {

        if (this._server) {

            const port = Number(this._config.smtpPort);

            this._server.listen(port, () => {
                this._logger.info('Server started', this._config.host, port);
            });


        } else {
            this._logger.error('Server instance is not available');
        }
    }

    /**
     * Stop the server
     */
    stop() {

        if (this._server) {

            this._server.close(() => {

                this._logger.info('Server stopped');

            });


        } else {
            this._logger.error('Server instance is not available');
        }
    }

    /**
     * Return whether the server is running
     * @returns {boolean} Whether the server is running
     */
    isRunning() {
        return this._server.listening;
    }

    /**
     * Triggered when a mail is received by the server
     * @param {MailObject} mail 
     */
    onMailReceived(mail) {
        this._logger.info('Mail received', mail);
    }

};

module.exports = VelocityServer;