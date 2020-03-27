const expect = require('chai').expect;
const utils = require('../src/utils/utils.js');

describe('lastOf()', () => {
	it('should return 8', () => {
		expect(utils.lastOf('this is a test', 'a')).to.be.equal(8);
	});

	it('should return -1', () => {
		expect(utils.lastOf('this is a test', 'f')).to.be.equal(-1);
	});
});


