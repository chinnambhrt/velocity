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

    }

    /**
     * Initialize the client
     */
    _init() {

        this._parser = new Parser(this);

        this._parser.onCommand = (r, c) => this.onCommand(r, c);

        this._addEventListeners();

    }


    _addEventListeners() {

        this._socket.pipe(this._parser);

        this._socket.on('end', this._onSocketEnd.bind(this));

        this._socket.on('error', this._onSocketError.bind(this));

    }


    /**
     * 
     * @param {string} smtpCommand 
     * @param {Function} callback 
     */
    onCommand(smtpCommand, callback) {

        const [command, ...args] = smtpCommand.split(/\s+/g);

        /**
         * @type {Function} handler
         */
        const handler = this[`handle_${command}`] || this.handle_UNKNOWN;

        if (typeof handler !== 'function') {
            callback('Handler is not a function');
            return;
        }

        handler.call(this, callback, ...args);

    }


    handle_EHLO(callback, ...args) {
        return this.handle_HELO(callback, ...args);
    }


    handle_HELO(callback, ...args) {

        const domain = args[0];

        if (!domain) {
            this._socket.write('501 Syntax: HELO hostname\r\n');
            return callback();
        }

        const capabilities = [];

        capabilities.push(`250-Nice to meet you ${domain}`);

        capabilities.push('250-PIPELINING');

        capabilities.push('250-ENHANCEDSTATUSCODES');

        capabilities.push('250-8BITMIME');

        capabilities.push('250 DSN');

        this._socket.write(capabilities.join('\r\n') + '\r\n');

        callback();
    }


    handle_UNKNOWN(callback, ...args) {

        this._socket.write('250 OK\r\n');

        callback()

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

};


module.exports = VelocityClient;