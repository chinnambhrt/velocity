
const Konfig = {

    // server
    host: 'localhost',

    /**
     * Domain name for which blaze will accept email
     */
    emailDomain: ['example.com'],

    /**
     * Port for the ESMTP server to listen on
     */
    smtpPort: process.env.V_PORT || 2525,


    /**
     * Port for the HTTP server to listen on
     */
    httpPort: process.env.V_HTTP_PORT || 3000,

    /**
     * Timeout for the server to wait for a response from the client
     */
    connectionTimeout: 1000 * 60 * 2,// 2 minutes,

    /**
     * Maximum number of connections to allow
     */
    maxConnections: 100,

    /**
     * Maximum size of an email in bytes (10MB)
     */
    maxEmailSize: 1024 * 1024 * 10,

    /**
     * indicates whether the server should use tls server or tcp server
     */
    secureServer: false,

    /**
     * Maximum number of recipients to allow
     * per email message
    */
    maxRecipients: 64,

    /**
     * Log level for the server
     * Possible values: 'info', 'debug', 'warn', 'error'
     */
    logLevel: process.env.V_LOG_LEVEL ||'info',

    /**
     * Path to the log file
     * If not provided, logs will be written to the console
     */
    logFileName: undefined,


    /**
     * Server capabilities
     */
    capabilities: {

        /**
         * `true` indicates server supports pipelining.
         * Pipelining is a way to send multiple commands to the server without waiting for a response. About the PIPELINING extension: 
         * @link{ https://tools.ietf.org/html/rfc2920 }
         */
        PIPELINING: false,

        /**
         * Chunking: The server supports chunking
         * Chunking is a way to send large messages in smaller parts.
         * About the CHUNKING extension: https://tools.ietf.org/html/rfc3030
         * Usage: https://tools.ietf.org/html/rfc3030#section-4
         */
        CHUNKING: false,
        /**
         * Size: The server supports the SIZE extension
         * The SIZE extension allows the client to specify the size of the message it is sending
         * so that the server can reject messages that are too large.
         * About the SIZE extension: https://tools.ietf.org/html/rfc1870
         * Usage: https://tools.ietf.org/html/rfc1870#section-4
         */
        SIZE: true,

        /**
         * StartTLS: The server supports the STARTTLS extension.
         * If this is set to true, the server will advertise the STARTTLS extension in the EHLO response.
         * About the STARTTLS extension: https://tools.ietf.org/html/rfc3207
         * STARTTLS is a way to take an existing insecure connection and upgrade it to a secure connection using SSL/TLS.
         */
        STARTTLS: true,

        /**
         * Enhanced Status Codes: The server supports the Enhanced Status Codes extension
         * Enhanced Status Codes provide more detailed information about the status of a message delivery.
         * About the Enhanced Status Codes extension: https://tools.ietf.org/html/rfc3463
         */
        ENHANCEDSTATUSCODES: true,


        /**
         * 8BITMIME: The server supports the 8BITMIME extension
         * 8BITMIME allows the client to send messages with 8-bit characters.
         * About the 8BITMIME extension: https://tools.ietf.org/html/rfc6152
         */
        _8BITMIME: true,


        /**
         * ETRN: The server supports the ETRN extension
         * ETRN is used to tell the server to process messages in the queue for a specific domain.
         * About the ETRN extension: https://tools.ietf.org/html/rfc1985
         */
        ETRN: false,

        /**
         * SMTPUTF8: The server supports the SMTPUTF8 extension
         * SMTPUTF8 allows the client to send messages with UTF-8 characters.
         * About the SMTPUTF8 extension: https://tools.ietf.org/html/rfc6531
         * SMTPUTF8 is used to support internationalized email addresses.
         */
        SMTPUTF8: true,

        /**
         * DSN: The server supports the DSN extension
         * DSN stands for Delivery Status Notification.
         * DSN is used to notify the sender of the status of the message delivery.
         * About the DSN extension: https://tools.ietf.org/html/rfc3461
         */
        DSN: true,
    },


    /**
     * TLS configuration
     */
    tls: {

        /**
         * Path to the private key file
         */
        key: process.env.SERVER_KEY || 'certs/server-key.pem',

        /**
         * Path to the certificate file
         */
        cert: process.env.SERVER_CERT || 'certs/server-cert.pem',

        /**
         * Path to the certificate authority file
         */
        ca: process.env.SERVER_CA || null,

        /**
         * Passphrase for the private key
         * plain text password should start with 'plain:'
         * e.g. 'plain:password'
         * if nothing is provided, by default it is assumed that the passphrase is in base64
         * e.g. 'cGFpbjpwYXNzd29yZA=='
         */
        passphrase: process.env.KEY_PASS || 'plain:test',

        /**
         * Minimum TLS version to accept
         */
        minVersion: 'TLSv1',

        /**
         * Maximum TLS version to accept
         */
        maxVersion: 'TLSv1.3',
    },

    /**
     * Development settings
     */
    development: {

        /**
         * Enable development settings
         */
        enabled: true,

        /**
         * Bypass authentication
         */
        bypassAuth: true,
    }



}


module.exports = Konfig;