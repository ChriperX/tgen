const expect = require('chai').expect;
const templates = require('../src/templates.js');

describe('if', () => {
	it('should not throw', () => {
		expect(function() {
			throw templates.loadTemplates([ 'test' ]);
		}).to.not.throw();
	});
});

describe('else', () => {
	it('should not throw', () => {
		expect(function() {
			throw templates.loadTemplates([ 'test2' ]);
		}).to.not.throw();
	});
});
