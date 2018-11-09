/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

// Module under test
const bob = require('..')

// Support
const { expect } = require('chai')

describe('The build-object-better package', () => {
  describe('with an array of keys and a value generating function', () => {
    it('should pass the key as the first argument to the generating function', () => {
      const result = bob(['a', 'b', 'c'], k => k.toUpperCase())
      expect(result).to.deep.equal({
        a: 'A',
        b: 'B',
        c: 'C'
      })
    })

    it('should pass the index of the key as the second argument to the generating function', () => {
      const result = bob(['a', 'b', 'c'], (k, i) => i)
      expect(result).to.deep.equal({
        a: 0,
        b: 1,
        c: 2
      })
    })

    it('should pass the array of keys as the third argument to the generating function', () => {
      const result = bob(['a', 'b', 'c'], (k, i, keys) => `${i}-${keys.join('-')}`)
      expect(result).to.deep.equal({
        a: '0-a-b-c',
        b: '1-a-b-c',
        c: '2-a-b-c'
      })
    })
  })
})
