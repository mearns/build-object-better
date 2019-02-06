/**
 * @module build-object-better
 */

const util = require('util')

const implicitConstantValueSupplierOfUnsupportedType = util.deprecate(
  (constantValue) => () => constantValue,
  'Starting in version 1.0, only constant values of type string, number, boolean, undefined, and null will be implicitly supported as suppliers.'
)

function parseValueSupplier (valueSupplier) {
  if (typeof valueSupplier === 'function') {
    return valueSupplier
  } else if (Array.isArray(valueSupplier)) {
    const values = valueSupplier
    return (k, i) => values[i]
  } else if (typeof valueSupplier === 'object' && valueSupplier !== null) {
    const source = valueSupplier
    return k => source[k]
  } else if (
    valueSupplier == null ||
    typeof valueSupplier === 'string' ||
    typeof valueSupplier === 'number' ||
    typeof valueSupplier === 'boolean' ||
    typeof valueSupplier === 'undefined'
  ) {
    const constantValue = valueSupplier
    return () => constantValue
  } else {
    return implicitConstantValueSupplierOfUnsupportedType(valueSupplier)
  }
}

function parseKeySupplier (keySupplier) {
  if (typeof keySupplier === 'function') {
    return keySupplier
  } else if (Array.isArray(keySupplier)) {
    const values = keySupplier
    return (e, i) => values[i]
  } else if (typeof keySupplier === 'object' && keySupplier !== null) {
    const source = keySupplier
    return e => source[e]
  }
  throw new TypeError(`Invalid key supplier, of type ${typeof keySupplier}`)
}

function fromTwoArgs (keys, valueSupplier) {
  const o = {}
  let k
  let i = 0
  valueSupplier = parseValueSupplier(valueSupplier)
  for (k of keys) {
    o[k] = valueSupplier(k, i, keys, k, keys)
    i++
  }
  return o
}

function fromThreeArgs (iterable, keySupplier, valueSupplier) {
  const o = {}
  const keys = []
  const allvit = []
  let e
  let k
  keySupplier = parseKeySupplier(keySupplier)
  valueSupplier = parseValueSupplier(valueSupplier)

  let i = 0
  for (e of iterable) {
    k = keySupplier(e, i, iterable)
    keys.push(k)
    allvit.push([k, e, i])
    i++
  }

  for ([k, e, i] of allvit) {
    o[k] = valueSupplier(k, i, keys, e, iterable)
  }
  return o
}

function fromEntriesIterable (entries) {
  const o = {}
  let e
  for (e of entries) {
    if (Array.isArray(e)) {
      o[e[0]] = e[1]
    } else {
      o[e.key] = e.value
    }
  }
  return o
}

function fromOneArg (entries) {
  if (entries && typeof entries[Symbol.iterator] === 'function') {
    return fromEntriesIterable(entries)
  } else {
    return Object.assign({}, entries)
  }
}

/**
 * The module exports a single function that is used for building an object in various ways. Different signatures are available as described below.
 *
 * In general, there are two ways to use the function: with one argument, or with two. With one argument, that argument fully specifies the properties
 * to create in the object, either as a sequence of key/value pairs, or else as a source object which is cloned.
 *
 * With two arguments, the first argument is an iterable of property names ("keys"), and the second argument describes how to determine the
 * value for each property.
 *
 * @param {...*} args See descriptions of different options below.
 */
module.exports = function buildObjectBetter (...args) {
  if (args.length === 1) {
    return fromOneArg(args[0])
  } else if (args.length === 2) {
    return fromTwoArgs(...args)
  } else if (args.length === 3) {
    return fromThreeArgs(...args)
  }
  throw new Error('Incorrect number of arguments: expected 1, 2, or 3')
}
