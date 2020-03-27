const expect = require('chai').expect;
const logger = require('../src/utils/logger.js');

describe('logger()', () => {
	it('should return message and logLevel', () => {
		expect(logger('this is a test', 'info')[1]).to.be.equal('this is a test');
		expect(logger('', 'info')[2]).to.be.equal('info');
	});
	it('should return 0', () => {
		expect(logger('', 'info')[0]).to.be.equal(0);
	});
});
