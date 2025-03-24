const { validateSPF } = require('spf-checker');

/**
 * 
 * @param {string} ip 
 * @param {string} domain 
 */
const validateSpf = async (ip, domain) => {

    let response = 'fail';

    try {
        response = await validateSPF(domain, ip);
    } catch (err) {
        console.error(err);
    }

    return response.result || 'fail';

}


module.exports = {
    validateSpf
}