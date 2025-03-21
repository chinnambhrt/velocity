const env = require('dotenv').config();
if (env.error) {
    console.error('Failed to load .env file');
    process.exit(1);
}
const Server = require('./lib/server');
const Config = require('./config/config');


const server = new Server(Config);

server.start();