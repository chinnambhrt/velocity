
/**
 * @class State - Represents the state of the client
 * @description This class is responsible for holding the state of the client
 */
class State {

    /**
     * @constructor - Creates an instance of the State class
     */
    constructor() {

        // data mode
        this.dataMode = false;


        /**
         * @type {boolean} ready tells if the client has said helo/ehlo
         * @description This property tells if the client has said helo/ehlo 
         */
        this.ready = false;

        /**
         * @type {string} domain holds the domain of the client that was sent as part of HELO/EHLO
         * @description This property holds the domain of the client
         */
        this.domainClaimed = '';

        /**
         * Domain SPF check result
         */
        this.spfResult = 'fail';

        // tls information of the client
        this.tls = {

            /**
             * @type {boolean} isUpgrading tells if the client is upgrading to a secure connection
             */
            isUpgrading: false,

            /**
             * @type {boolean} isSecure tells if the connection is secure
             */
            isSecure: false

        };

        // authentication information of the client
        this.authentication = {

            /**
             * @type {boolean} isAuthenticated tells if the client is authenticated
             */
            isAuthenticated: false,

            /**
             * @type {string} mechanism holds the authentication mechanism          
             */
            mechanism: '',

            /**
             * @type {string} user holds the user information
             */
            user: {},
        };


        this.mail = {

            /**
             * @type {string} from holds the from information
             */
            from: '',

            /**
             * @type {string[]} recipients holds the recipients information
             */
            recipients: [],

            /**
             * @type {Buffer} data holds the data information
             */
            data: Buffer.from('', 'binary'),

            /**
             * holds the expected size of the data that is sent using the mail command
             * @type {number} expectedSize size in bytes
             */
            expectedSize: -1,


            // default 7bit
            /**
             * @type {string} encoding holds the encoding information
             */
            encoding: '7bit',
        };

    }


    /**
     * @method reset - Resets the state of the client
     * @description This method resets the state of the client
     */
    reset() {

        this.dataMode = false;

        this.mail = {
            from: '',
            recipients: [],
            data: Buffer.from('', 'binary'),
            expectedSize: -1,
            encoding: '7bit'
        };

        this.authentication = {
            isAuthenticated: false,
            mechanism: '',
            user: {}
        }

    }

}


module.exports = State;