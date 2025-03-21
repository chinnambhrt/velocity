module.exports = {

    EHLO: require('../commands/ehlo'),

    HELO: require('../commands/ehlo'),

    MAIL: require('../commands/mail'),

    RCPT: require('../commands/rcpt'),

    DATA: require('../commands/data'),

    RSET: require('../commands/rset'),

    NOOP: require('../commands/noop'),

    QUIT: require('../commands/quit'),

    STARTTLS: require('../commands/starttls'),

};