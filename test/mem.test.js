/* eslint-env mocha */

const mem = require('../src/utils/mem.js');
const expect = require('chai').expect;

describe('mem', () => {
	describe('newVar()', () => {
		it('should return contents', () => {
			expect(mem.newVar('new var', 'test var')).to.be.equal('new var');
		});
	});

	describe('fetch()', () => {
		it('should return test var', () => {
			expect(mem.fetch('test var')).to.be.equal('new var');
		});
	});

	describe('replaceVars()', () => {
		it('should return the string with vars', () => {
			expect(mem.replaceVars('this (is) a ${{test var}}')).to.be.equal('this (is) a new var');
		});
	});
	describe('containsVar()', () => {
		it('should return true', () => {
			/*eslint no-template-curly-in-string: */
			expect(mem.containsVar('${{_}}')).to.be.true;
			expect(mem.containsVar('${{test}}')).to.be.true;
			expect(mem.containsVar('${{_test}}')).to.be.true;
			expect(mem.containsVar('${{_test123}}')).to.be.true;
			expect(mem.containsVar('${{_12}}')).to.be.true;
		});
		it('should not be true', () => {
			expect(mem.containsVar('${{_}')).to.not.be.true;
			expect(mem.containsVar('${{1_}}')).to.not.be.true;
			expect(mem.containsVar('${{_-a}}')).to.not.be.true;
			expect(mem.containsVar('{{a}}')).to.not.be.true;
		});
	});
});
