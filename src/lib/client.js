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

        this._addEventListeners();

    }


    _addEventListeners() {

        this._socket.pipe(this._parser);

        this._socket.on('end', this._onSocketEnd.bind(this));

        this._socket.on('error', this._onSocketError.bind(this));

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