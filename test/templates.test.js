/* eslint-env mocha */

const expect = require('chai').expect;
const templates = require('../cli/templates.js');

describe('templates.loadTemplates()', () => {
	it('should return 0', () => {
		expect(templates.loadTemplates([ 'blank' ])).to.be.equal(0);
	});
	it('should return 1', () => {
		expect(templates.loadTemplates([ 'safasgad' ])).to.be.equal(1);
	});

	it('should not throw', () => {
		expect(function() {
			throw templates.loadTemplates([ 'test2' ]);
		}).to.not.throw();
	});
});

describe('templates.templateKeys', () => {
	it('should not return undefined', () => {
		expect(templates.templateKeys.if).to.not.be.undefined;
	});

	it('should return undefined', () => {
		expect(templates.templateKeys.saf).to.be.undefined;
	});

	it('should throw', () => {
		expect(function() {
			throw templates.templateKeys.if([ { a: { log: { info: 'test' } } } ]);
		}).to.throw();
	});
});

describe('template.pluginList', () => {
	it('should not be empty', () => {});
});
