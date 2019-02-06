/**
 * @module build-object-better
 */

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
    typeof valueSupplier === 'undefined' ||
    typeof valueSupplier === 'symbol'
  ) {
    const constantValue = valueSupplier
    return () => constantValue
  } else {
    throw new TypeError(`Invalid value supplier of type ${typeof valueSupplier}`)
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

function buildObjectBetter (...args) {
  if (args.length === 1) {
    return fromOneArg(args[0])
  } else if (args.length === 2) {
    return fromTwoArgs(...args)
  } else if (args.length === 3) {
    return fromThreeArgs(...args)
  }
  throw new Error('Incorrect number of arguments: expected 1, 2, or 3')
}

module.exports = buildObjectBetter

function isThennable (x) {
  return x && typeof x === 'object' && typeof x.then === 'function'
}

buildObjectBetter.async = function buildObjectBetterAsync (...args) {
  let p = Promise.resolve([])
  for (let arg of args) {
    if (isThennable) {
      p = p.then((prior) => {
        return arg.then(resolvedArg => {
          prior.push(resolvedArg)
          return prior
        })
      })
    } else {
      p = p.then((prior) => {
        prior.push(arg)
        return prior
      })
    }
  }

  return p.then(resolvedArgs => {
    if (resolvedArgs.length === 1) {
      return fromOneArg(resolvedArgs[0])
    } else if (resolvedArgs.length === 2) {
      return fromTwoArgs(...resolvedArgs)
    } else if (resolvedArgs.length === 3) {
      return fromThreeArgs(...resolvedArgs)
    }
    throw new Error('Incorrect number of arguments: expected 1, 2, or 3')
  })
    // XXX: TODO: FIXME: This might work for asynchronous value suppliers, but haven't accounted for
    // asynchronous key suppliers.
    .then(obj => {
      let p = Promise.resolve(obj)
      for (let [k, v] of Object.entries(obj)) {
        if (isThennable(v)) {
          p = p.then(() => v).then(resolvedValue => {
            obj[k] = resolvedValue
            return obj
          })
        }
      }
    })
}
