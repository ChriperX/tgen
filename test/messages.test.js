const expect = require('chai').expect;
const messages = require('../src/messages.js');

describe('messages.js', () => {
	describe('logMessages', () => {
		it('should import successfully the plugins', () => {
			expect(messages.logMessages).to.not.be.equal({});
		});
	});

	describe('newMessageType()', () => {
		const test = messages.newMessageType('test');
		const test2 = messages.newMessageType('test');
		it('should return the function.', () => {
			expect(test).to.be.instanceOf(Function);
		});
		it('should return the normal string.', () => {
			expect(test('This is a test', 'test_msg_01')).to.be.equal('This is a test');
		});
		it('should return the modified string.', () => {
			messages.logMessages['test'] = {};
			messages.logMessages['test']['test_msg_01'] = 'Test';
			expect(test('This is a test', 'test_msg_01')).to.be.equal('Test');
		});
		it('should return the normal message.', () => {
			messages.logMessages['test'] = {};
			expect(test('This is a test', 'test_msg_01')).to.be.equal('This is a test');
		});
		it('should return the same modified message', () => {
			messages.logMessages['test'] = {};
			messages.logMessages['test']['test_msg_01'] = 'Test';
			expect(test2('This is a test', 'test_msg_01')).to.be.equal('Test');
		});
	});
});
