// Desc: Utility functions for parsing commands
// Author: Bharath
const url = require('url');

module.exports = {
    /**
     * Returns a object with email address, domain and other args passed in the command
     * @param {string} input 
     */
    fetchAddress: (input) => {

        const command = input.split(':')[1];

        const [email, ...args] = command.split(/\s+/g);

        if (!email) {
            return undefined;
        }

        const address = email.replace('<', '').replace('>', '');

        const [user, domain] = address.split('@');

        // too bad, we need to convert the domain to unicode, we commit to support IDN
        let unicodeDomain = url.domainToUnicode(domain);

        if (!unicodeDomain) {
            return undefined;
        }

        let response = {};

        response.email = user + '@' + unicodeDomain;

        response.args = {};

        args.forEach(arg => {
            const [key, value] = arg.split('=');
            response.args[key] = value;
        });


        return response;
    }

}