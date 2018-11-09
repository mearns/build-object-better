
function fromTwoArgs (keys, valueGenerator) {
  const o = {}
  let k
  if (typeof valueGenerator !== 'function') {
    if (Array.isArray(valueGenerator)) {
      const values = valueGenerator
      valueGenerator = (k, i) => values[i]
    } else if (typeof valueGenerator === 'object') {
      const source = valueGenerator
      valueGenerator = k => source[k]
    } else {
      const constantValue = valueGenerator
      valueGenerator = () => constantValue
    }
  }

  let i = 0
  for (k of keys) {
    o[k] = valueGenerator(k, i, keys)
    i++
  }
  return o
}

function fromOneArg (entries) {
  if (entries && typeof entries[Symbol.iterator] === 'function') {
    const o = {}
    let e
    for (e of entries) {
      if (Array.isArray(e)) {
        o[e[0]] = e[1]
      } else if (typeof e === 'object') {
        o[e.key] = e.value
      }
    }
    return o
  } else {
    return Object.assign({}, entries)
  }
}

module.exports = function buildObjectBetter (...args) {
  if (args.length === 1) {
    return fromOneArg(args[0])
  } else {
    return fromTwoArgs(...args)
  }
}
