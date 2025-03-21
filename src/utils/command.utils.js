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

        let response = {};

        const address = email.replace('<', '').replace('>', '');

        response.email = address;

        response.args = {};

        args.forEach(arg => {
            const [key, value] = arg.split('=');
            response.args[key] = value;
        });


        return response;
    }

}