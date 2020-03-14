const expect = require('chai').expect;
const index = require('../src/index.js');

describe('index.commands', () => {
	it('should be undefined', () => {
		expect(index.commands['saf']).to.be.undefined;
	});
	it('should throw an error', () => {
		expect(function() {
			throw index.commands['safg']['cb']();
		}).to.throw();
	});

	it('should not throw an error', () => {
		expect(function() {
			throw index.commands['test']['cb']();
		}).to.not.throw();
	});
});

describe('index.pluginInfo', () => {
    it('should be undefined', () => {
        expect(index.pluginInfo).to.be
    })
})