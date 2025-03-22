
const MailObject = require('../types/mail-object');
const Config = require('../config/config')
const Logger = require('../logger');

/**
 * EmailHandler handles all the email received by the server
 */
class EmailHandler {

    /**
     * Constructor
     * @param {Config} config The configuration object
     */
    constructor(config) {

        /**
         * Configuration object
         */
        this.config = config;

        /**
         * The email queue
         * @type {MailObject[]}
         */
        this._mails = [];

        this._logger = new Logger(EmailHandler.name, {
            logLevel: this.config.logLevel
        });

    }


    /**
     * Add email to the queue of the email handle for processing
     * @param {MailObject} mail The mail object
     * @param {Function} callback 
     * @returns {boolean} True if the email was added to the queue, false otherwise
     */
    addEmailToQueue(mail) {

        /**
         * If the email queue is full 
         * we reject the current email and return an error
         * 
         * @todo Dos we want to send the mail to rejection queue/ or send a rejection status code
         * or just drop the email
         * 
         * use real queues like Kafka or RabbitMQ
         * 
         */
        if (this._mails.length >= 500) {
            this._logger.warn('queue is full, rejecting email');
            return false;
        }

        // push the email in the queue
        this._mails.push(mail);

        this._logger.info('added to queue', mail.from, mail.to.join(','));

        return true;

    }

}

module.exports = EmailHandler;