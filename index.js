/**
 * @module build-object-better
 */

const util = require('util')

const implicitConstantValueSupplierOfUnsupportedType = util.deprecate(
  (constantValue) => () => constantValue,
  'Starting in version 2.0, only constant values of type string, number, boolean, undefined, and null will be implicitly supported as suppliers.'
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
  } else if (!(
    valueSupplier == null ||
    typeof valueSupplier === 'string' ||
    typeof valueSupplier === 'number' ||
    typeof valueSupplier === 'boolean' ||
    typeof valueSupplier === 'undefined'
  )) {
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
  throw new Error(`Invalid key supplier, of type ${typeof keySupplier}`)
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

/**
 * Build an object from an iterable of property names and a function to generate corresponding values for each one.
 *
 * @name bob
 * @memberof module:build-object-better
 * @function
 * @param {Iterable<*>} keys An iterable (e.g., an Array) describing the keys (i.e. property names) that your object will be given.
 * @param {function(*, number, Iterable<*>):*} valueCalculator A function that is used to generate the values of your
 * object's properties. It is invoked once for each of the provided keys, with the key itself, the index of the key in `keys`,
 * and the complete `keys` iterable as arguments.
 */

/**
 * Build an object from a sequence of property names and corresponding property values.
 *
 * @name bob
 * @memberof module:build-object-better
 * @function
 * @param {Iterable<*>} keys An iterable (e.g., an Array) describing the keys (i.e. property names) that your object will be given.
 * @param {Array<*>} values An array of property values for your object. These will be "zipped" with the provided keys, so, for instance,
 * the third key in `keys` will be assigned the third element (index `2`) in `values`.
 */

/**
 * Build an object by copying a specified set of properties from another object.
 *
 * @name bob
 * @memberof module:build-object-better
 * @function
 * @param {Iterable<*>} keys An iterable (e.g., an Array) describing the keys (i.e. property names) that your object will be given.
 * @param {Object} source An object from which property values will be copied. For each key in `keys`, the value for that property
 * will be taken as the value of the property with the same name from this object. Note that this will walk the entire prototype
 * chain as needed to find the property, and produce an `undefined` value for any missing properties.
 */

/**
 * Build an object with specified properties, all of which have the same value.
 *
 * @name bob
 * @memberof module:build-object-better
 * @function
 * @param {Iterable<*>} keys An iterable (e.g., an Array) describing the keys (i.e. property names) that your object will be given.
 * @param {primitive} value A constant value that will be used as the value for all properties of your object.
 */

/**
 * Build an object from an iterable of entries, each giving the name and value of one property in the object (e.g., as returned by
 * `Object.entries`).
 *
 * @name bob
 * @memberof module:build-object-better
 * @function
 * @param {Iterable<(Array|{key, value})>} entries An iterable of entries, each entry specifying both the name and value of a property
 * for your object. Each entry can be an Array, or an object. If an Array, then the first item (index 0) in the Array is the name
 * of the property (the "key"), and the second item (index 1) is the property value. If the entry is not an array, then it is assumed
 * to be an Object with a "key" property specifying the property name, and a "value" property specifying its value.
 */

/**
 * Build an object as a shallow-clone of another object. The returned object will have all the same _own_ properties as the provided
 * source, with the same value. Values are not cloned, but copied directly, thus non-primitive objects (such as Arrays and Objects)
 * will actually be references to the same in-memory value.
 * @name bob
 * @memberof module:build-object-better
 * @function
 * @param {Object} source The object to clone.
 */
