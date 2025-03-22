

class MailObject {

    /**
     * 
     * @param {string} from 
     * @param {string[]} to 
     * @param {string} rawData 
     * @param {string} encoding 
     * @param {number} size 
     */
    constructor(
        from,
        to,
        rawData,
        encoding,
        size,
    ) {

        this.from = from;

        this.to = to;

        this.rawData = rawData;

        this.encoding = encoding;

        this.size = size;

    }

};


module.exports = MailObject;