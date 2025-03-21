const fs = require('fs');
const Path = require('path')

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];

class Logger {

    constructor(name, options) {
        this.name = name;
        this.logLevel = options.logLevel || 'info';
        this.logFileName = options.logFileName || false;
        this.logToFile = false;
        if (this.logFileName) {
            this.logFile = fs.createWriteStream(Path.join('logs', this.logFileName), { flags: 'a' });
            this.logToFile = true;
        }
    }

    _log(level, ...message) {

        const timestamp = new Date().toLocaleString();

        if (LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(this.logLevel)) {
            if (this.logToFile) {
                const payload = `[${level.toUpperCase()}] ${timestamp} | ${this.name} ${message.join(' ')}\n`;
                this.logFile.write(payload);
            } else {
                console.log(`[${level.toUpperCase()}]`, timestamp, '|', this.name, ...message);
            }
        }
    }

    /**
     * debug the message
     * @param  {...any} message 
     */
    debug(...message) {
        this._log('debug', ...message);
    }

    info(...message) {
        this._log('info', ...message);
    }

    warn(...message) {
        this._log('warn', ...message);
    }

    error(...message) {
        this._log('error', ...message);
    }


}

module.exports = Logger;