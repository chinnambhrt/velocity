const net = require('net');

const tls = require('tls');

const fs = require('fs');

const path = require('path');

const Logger = require('../logger');

const EventEmitter = require('events');

const Config = require('../config/config');

const Parser = require('./parser');

const { randomUUID } = require('crypto');

const State = require('./state');

const handlers = require('./commands');

const MailObject = require('../types/mail-object');

const responses = require('./responses');


/**
 * Velocity Client class, used to represent a connected client
 * @extends EventEmitter
 */
class VelocityClient extends EventEmitter {

    /**
     * 
     * @param {net.Socket} socket 
     * @param {Config} config 
     */
    constructor(socket, config) {

        super();

        // generate a unique id
        this._id = randomUUID().toString();

        // store the socket
        this._socket = socket;

        // store the config
        this._config = config;

        // create the state
        this._state = new State();

        // create the logger
        this._logger = new Logger(this._id, {
            logLevel: config.logLevel
        });

        // initialize the client
        this._init();

        /**
         * Hold all the safenet related data
         */
        this.safenet = {

            /**
             * The number of unrecognized commands sent by the client
             */
            unrecognizedCommands: 0,

            /**
             * The last command sent by the client
             */
            previousCommand: '',

            /**
             * The number of times the client has sent the no greeting commands
             * in loop without doing anything else. These are bad guys
             * who are trying to keep the connection open without doing anything
             * useful. Disconnect them after certain number of commands
             */
            noGreetLoopCount: 0,

            /**
             * Checks if the command is a HTTP command, we do not want those users
             * to be around disconnect them
             * @param {string} command 
             * @returns 
             */
            isHttpCommand: (command) => {
                return /^(OPTIONS|GET|HEAD|POST|PUT|DELETE|TRACE|CONNECT) \/.* HTTP\/\d\.\d$/i.test(command)
            }

        }

    }

    /**
     * Initialize the client
     */
    _init() {

        this._parser = new Parser(this);

        this._parser.onCommand = (r, c) => this.onCommand(r, c);

        this._addEventListeners();

    }

    /**
     * Add event listeners to the socket
     */
    _addEventListeners() {

        this._socket.pipe(this._parser);

        this._socket.on('end', this._onSocketEnd.bind(this));

        this._socket.on('error', this._onSocketError.bind(this));

    }

    /**
     * Starts the data mode for the client
     */
    startDataMode() {

        this._state.dataMode = true;

    }

    /**
     * Ends the data mode for the client
     * @param {Error} error 
     */
    endDataMode(error) {

        this._state.dataMode = false

        if (error) {
            this._logger.info('Error in data mode', error);
            return;
        }

        const mail = new MailObject(
            this._state.mail.from,
            this._state.mail.recipients,
            this._state.mail.data.toString('utf-8'),
            this._state.mail.encoding,
            this._state.mail.data.length
        );

        this._emitMailEvent(mail);

    }



    /**
     * 
     * @param {string} smtpCommand 
     * @param {Function} callback 
     */
    onCommand(smtpCommand, callback) {

        const [command, ...args] = smtpCommand.split(/\s+/g);

        const knownCommands = Object.keys(handlers);

        if (!knownCommands.includes(command)) {

            if (this.safenet.isHttpCommand(command)) {
                
                this._logger.warn('Client is trying to send a HTTP command; disconnecting');

                this.disconnect();
                
                return;
            }

            // increment the safenet uncognized commands count
            // this will not be reset until the client disconnects
            // good guys will not fiddle with the system
            this.safenet.unrecognizedCommands++;

            // 10 is the hard limit for unrecognized commands
            if (this.safenet.unrecognizedCommands > 10) {

                // TODO: add the user to the safenet blacklist
                this._logger.warn('Client has sent too many unrecognized commands; disconnecting');

                this.disconnect();

                return;
            }

            this.sendResponse(500, 'Command not recognized');

            return callback();
        }

        // commands that do not require a EHLO/HELO greeting
        const noGreetCommands = ['HELO', 'EHLO', 'STARTTLS', 'QUIT', 'NOOP', 'RSET'];

        if (!this._state.ready) {

            // if the client has not sent a HELO/EHLO command
            if (!noGreetCommands.includes(command)) {

                this.useResponse(responses.HELLO.HELLO_REQUIRED);

                return callback();

            }

            // check if the client is trying to keep the connection open
            // without doing anything useful
            if (noGreetCommands.includes(this.safenet.previousCommand)) {

                this.safenet.noGreetLoopCount++;

                /**
                 * If the client has sent the no greet commands in loop
                 * without doing anything else, disconnect them
                 */
                if (this.safenet.noGreetLoopCount > 5) {

                    this._logger.warn('Client is looping through no greet commands; disconnecting');

                    this.disconnect();

                    return;

                }
            } else {
                // reset the loop count
                this.safenet.noGreetLoopCount = 0;

            }

        }


        /**
         * @type {Function} handler
         */
        const handler = handlers[command];

        if (typeof handler !== 'function') {
            callback('Handler is not a function');
            return;
        }

        handler(this, smtpCommand, callback);

    }

    upgradeToTls(callback) {

        if (this._state.tls.isSecure) {
            this._socket.write('454 TLS already active\r\n');
            return callback();
        }

        this._socket.write('220 Ready to start TLS\r\n');

        this._socket.removeAllListeners();

        this._socket.unpipe(this._parser);

        setImmediate(callback);

        let tlsOptions = {};

        tlsOptions.key = fs.readFileSync(path.resolve(this._config.tls.key))
        tlsOptions.cert = fs.readFileSync(path.resolve(this._config.tls.cert))

        if (this._config.tls.ca) {
            tlsOptions.ca = fs.readFileSync(path.resolve(this._config.tls.ca))
        }

        if (this._config.tls.passphrase) {

            const keyPass = this._config.tls.passphrase

            if (keyPass.startsWith('plain:')) {
                tlsOptions.passphrase = keyPass.replace('plain:', '')
            } else {
                tlsOptions.passphrase = Buffer.from(keyPass, 'base64').toString('utf-8')
            }
        }

        const secureSocket = new tls.TLSSocket(this._socket, {
            secureContext: tls.createSecureContext(tlsOptions),
            isServer: true,
        });

        secureSocket.once('secure', () => {

            this._logger.info('Client upgraded to TLS using:', secureSocket.getCipher().standardName);

            this._socket = secureSocket;

            this._state.tls.isSecure = true;

            this._state.tls.isUpgrading = false;

            this._addEventListeners();

        });


    }

    /**
     * 
     * @param {number} code 
     * @param {string | string[]} message 
     */
    sendResponse(code, message) {

        let payload = Array.isArray(message) ? message.join('\r\n') : message;

        if (code) {
            payload = `${code} ${payload}`;
        }

        if (!payload.endsWith('\r\n')) {
            payload += '\r\n';
        }

        if (
            this._socket &&
            this._socket.readyState === 'open' &&
            this._socket.writable
        ) {

            this._socket.write(payload);
            this._logger.debug('S:', payload.trim());
        }

    }

    /**
     * Sends a response from the responses collection
     * @param {{
     * code:number,
     * enhancedCode:string,
     * message:string
     * }} response to send to the client
     */
    useResponse(response) {

        const { code, enhancedCode, message } = response;

        const payload = `${enhancedCode} ${message}`;

        this.sendResponse(code, payload);

    }


    /**
     * Disconnect the client
     */
    disconnect(message) {

        const payload = message || '221 Goodbye\r\n';

        if (this._socket && !this._socket.closed) {

            this._socket.end(payload);

        }
    }


    /**
     * Handle the socket error event
     * @param {Error} error 
     */
    _onSocketError(error) {
        this._logger.error('Socket error', error);
    }

    /**
     * Handle the socket end event
     */
    _onSocketEnd() {

        // this._logger.info('Client disconnected', this._id);

        this.emit('disconnected', this._id);

    }

    /**
     * Emit the mail event with the mail object
     * @param {MailObject} mail 
     */
    async _emitMailEvent(mail) {
        // this._logger.debug('Mail received', JSON.stringify(mail));
        this.emit('mail', mail);
    }

};


module.exports = VelocityClient;