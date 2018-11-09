
module.exports = function buildObjectBetter (...args) {
  const o = {}
  if (args.length === 1) {
    const [entries] = args
    let e
    for (e of entries) {
      if (Array.isArray(e)) {
        o[e[0]] = e[1]
      } else if (typeof e === 'object') {
        o[e.key] = e.value
      }
    }
  } else {
    let k
    let [keys, valueGenerator] = args
    if (Array.isArray(valueGenerator)) {
      const values = valueGenerator
      valueGenerator = (k, i) => values[i]
    } else if (typeof valueGenerator !== 'function') {
      const source = valueGenerator
      valueGenerator = k => source[k]
    }
    let i = 0
    for (k of keys) {
      o[k] = valueGenerator(k, i, keys)
      i++
    }
  }
  return o
}
