/* eslint-env mocha */
/*eslint no-template-curly-in-string: */

const mem = require('../cli/utils/mem.js');
const expect = require('chai').expect;

describe('mem', () => {
	describe('newVar()', () => {
		it('should return contents', () => {
			expect(mem.newVar('new var', 'test_var')).to.be.equal('new var');
		});
		it('should not throw', () => {
			expect(() => {
				throw mem.newVar('new var', 'test_var');
			}).to.not.throw(new SyntaxError("Invalid character in var name: 'test_var'."));
		});
		it('should throw', () => {
			expect(() => {
				throw mem.newVar('new var', 'test var');
			}).to.throw();
		});
	});

	describe('fetch()', () => {
		it('should return test var', () => {
			expect(mem.fetch('test_var')).to.be.equal('new var');
		});
	});

	describe('replaceVars()', () => {
		it('should return the string with vars', () => {
			expect(mem.replaceVars('this (is) a ${{test_var }}')).to.be.equal('this (is) a new var');
		});
		it('should replace more than one variable', () => {
			expect(
				mem.replaceVars('this is a ${{test_var}} ${{ test_var }} ${{ test_var}} ${{ this_is_not_a_real_var }}')
			).to.be.equal('this is a new var new var new var ${{ this_is_not_a_real_var }}');
		});
	});
	describe('containsVar()', () => {
		it('should match with an underscore', () => {
			expect(mem.containsVar('${{_}}')).to.be.true;
		});
		it('should match with whitespaces at the start and at the end of the variable', () => {
			expect(mem.containsVar('${{ test   }}')).to.be.true;
		});
		it('should match with underscores', () => {
			expect(mem.containsVar('${{___testVar___}}')).to.be.true;
		});
		it('should match only the var name', () => {
			expect(mem.containsVar('${{test}}')).to.be.true;
		});
		it("should match even if the numbers aren't at the start", () => {
			expect(mem.containsVar('${{test23}}')).to.be.true;
		});
		it('should match even if the numbers are at the start', () => {
			expect(mem.containsVar('${{1test}}')).to.be.true;
		});

		//to be false

		it("shouldn't match with alphanumerical chars", () => {
			expect(mem.containsVar('${{$}}')).to.not.be.true;
		});
		it("shouldn't match with spaces beetween the var name", () => {
			expect(mem.containsVar('${{this is a test}}')).to.not.be.true;
		});
	});
});
