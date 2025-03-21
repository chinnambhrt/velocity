// Desc: Test cases for the SMTP server
// Author: Bharath Chinnam
const VelocityServer = require('../src/lib/server');
const config = require('../src/config/config');
const { expect } = require('chai');

const server = new VelocityServer(config);

describe('Velocity ESMTP Server', () => {

    beforeEach(() => {
        server.start();
    });

    afterEach(() => {
        server.stop();
    });


    it('should start the server', () => {
        expect(server.isRunning()).to.be.true;
    });

    it('should stop the server', () => {
        server.stop();
        expect(server.isRunning()).to.be.false;
    });

});