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

    //#endregion

};