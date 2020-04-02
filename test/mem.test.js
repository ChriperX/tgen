/* eslint-env mocha */

const mem = require('../src/utils/mem.js')
const expect = require('chai').expect

describe('mem', () => {
  describe('newVar()', () => {
    it('should return contents', () => {
      expect(mem.newVar('new var', 'test var')).to.be.equal('new var')
    })
  })

  describe('fetch()', () => {
    it('should return test var', () => {
      expect(mem.fetch('test var')).to.be.equal('new var')
    })
  })

  describe('replaceVars()', () => {
    it('should return the string with vars', () => {
      expect(mem.replaceVars('this (is) a $(test var)')).to.be.equal('this (is) a new var')
    })
  })
})
