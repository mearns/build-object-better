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

  describe('with an array of keys, and an array of values', () => {
    it('should use keys as keys and values as values', () => {
      const result = bob(['a', 'b', 'c'], ['alpha', 'bravo', 'charlie'])
      expect(result).to.deep.equal({
        a: 'alpha',
        b: 'bravo',
        c: 'charlie'
      })
    })
  })

  describe('with an array of keys, and an object of values', () => {
    it('should use keys as keys, and select the same properties from the given source object as the values', () => {
      const result = bob(['a', 'c', 'd'], { b: 'Banana', 0: 'Zero', a: 'Apple', d: 'Data', c: 'Cookie', e: 'Eggs' })
      expect(result).to.deep.equal({
        a: 'Apple',
        c: 'Cookie',
        d: 'Data'
      })
    })
  })

  describe('Using other iterables of keys', () => {
    testCall('should support a string as the keys',
      'abcd', { a: 'Alpha', c: 'Cookie', d: 'Donut' },
      {
        a: 'Alpha',
        b: undefined,
        c: 'Cookie',
        d: 'Donut'
      }
    )

    testCall('should support a TypedArray of keys',
      new Uint8Array([0x00, 0x7F, 0xFF]), ['first', 'second', 'third'],
      {
        '0': 'first',
        '127': 'second',
        '255': 'third'
      }
    )

    testCall('should support a Set of keys',
      new Set(['a', 'a', 'b', 'd', 'b', 'c']), (k, i) => `${k}-${i}`,
      {
        a: 'a-0',
        b: 'b-1',
        d: 'd-2',
        c: 'c-3'
      }
    )

    ;(function () {
      testCall('should support an arguments object of keys',
        arguments, (k, i) => `${k.toUpperCase()}-${i + 1}`,
        {
          a: 'A-1',
          c: 'C-2',
          b: 'B-3',
          f: 'F-4'
        }
      )
    })('a', 'c', 'b', 'f')

    testCall('Should support an object with a Symbol.iterator function as the keys',
      {
        [Symbol.iterator]: () => {
          let i = 0
          return {
            next: () => {
              if (i < 3) {
                return { value: i++, done: false }
              }
              return { done: true }
            }
          }
        }
      }, ['un', 'deux', 'trois'],
      {
        0: 'un',
        1: 'deux',
        2: 'trois'
      }
    )
  })

  describe('with a single argument which is an iterable', () => {
    testCall('elements which are arrays should be used as key, value pairs in that order',
      [['a', 'Alpha'], ['b', 'Bravo'], ['c', 'Charlie']],
      {
        a: 'Alpha',
        b: 'Bravo',
        c: 'Charlie'
      }
    )

    testCall('elements which Objects but not arrays should provide "key" and "value" properties',
      [{ key: 'a', value: 'alpha' }, { key: 'c', value: 'charles' }],
      {
        a: 'alpha',
        c: 'charles'
      }
    )
  })
})

function testCall (should, ...args) {
  const callArgs = args.slice(0, args.length - 1)
  const expected = args[args.length - 1]
  it(should, () => {
    const result = bob(...callArgs)
    expect(result).to.deep.equal(expected)
  })
}
