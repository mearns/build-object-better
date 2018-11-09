
module.exports = function buildObjectBetter (...args) {
  const o = {}
  if (args.length === 1) {
    const [entries] = args
    if (entries && typeof entries[Symbol.iterator] === 'function') {
      let e
      for (e of entries) {
        if (Array.isArray(e)) {
          o[e[0]] = e[1]
        } else if (typeof e === 'object') {
          o[e.key] = e.value
        }
      }
    } else {
      return Object.assign({}, entries)
    }
  } else {
    let k
    let [keys, valueGenerator] = args
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
  }
  return o
}
