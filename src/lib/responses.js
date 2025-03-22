module.exports = {

    INVALID_COMMAND: {
        code: 500,
        enhancedCode: '5.5.2',
        message: 'Command not recognized'
    },


    //#region Hello related responses

    HELLO: {

        HELLO_REQUIRED: {
            code: 530,
            enhancedCode: '5.7.0',
            message: 'Must issue a HELO/EHLO command first'
        },


        HELLO_INVALID_SYNTAX: {
            code: 501,
            enhancedCode: '5.5.4',
            message: 'Syntax: HELO hostname'
        }
    },

    MAIL: {

        MAIL_INVALID_SYNTAX: {
            code: 501,
            enhancedCode: '5.5.4',
            message: 'Syntax: MAIL FROM: <address>'
        },

        MAIL_INVALID_SENDER: {
            code: 553,
            enhancedCode: '5.1.7',
            message: 'Invalid sender'
        },

        MAIL_OK: {
            code: 250,
            enhancedCode: '2.1.0',
            message: 'Sender OK'
        }

    },

    RCPT: {

        RCPT_INVALID_SYNTAX: {
            code: 501,
            enhancedCode: '5.5.4',
            message: 'Syntax: RCPT TO: <address>'
        },

        RCPT_OK: {
            code: 250,
            enhancedCode: '2.1.5',
            message: 'Recipient OK'
        },

        RCPT_INVALID_RECIPIENT: {
            code: 553,
            enhancedCode: '5.1.7',
            message: 'Invalid recipient'
        },

        RCPT_MAIL_REQUIRED: {
            code: 503,
            enhancedCode: '5.5.1',
            message: 'Must issue MAIL command first'
        },

        RECIPIENT_REQUIRED: {
            code: 503,
            enhancedCode: '5.5.1',
            message: 'Must issue RCPT command first'
        }



    },

    DATA: {

        DATA_START_INPUT: {
            code: 354,
            enhancedCode: '2.7.0',
            message: 'Start mail input; end with <CRLF>.<CRLF>'
        },

        DATA_MAIL_ACCEPTED: {
            code: 250,
            enhancedCode: '2.6.0',
            message: 'Ok; Mail queued for delivery'
        },

        EXCEEDS_MAX_SIZE: {
            code: 552,
            enhancedCode: '5.2.3',
            message: 'Message exceeds allowed size'
        },

        ERROR: {
            code: 451,
            enhancedCode: '4.3.0',
            message: 'Error processing message. Try again later'
        }

    },

    VRFY: {

        VRFY_NOT_SUPPORTED: {
            code: 502,
            enhancedCode: '5.5.1',
            message: 'Command not implemented'
        },

        VRFY_INVALID_SYNTAX: {
            code: 501,
            enhancedCode: '5.5.4',
            message: 'Syntax: VRFY <address>'
        },

        VRFY_OK: {
            code: 252,
            enhancedCode: '2.5.2',
            message: 'Cannot VRFY user, but will accept message and attempt delivery'
        }

    }

    //#endregion

};