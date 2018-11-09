
module.exports = function buildObjectBetter (keys, ...args) {
  const o = {}
  let k
  if (args.length === 0) {
    for (k of keys) {
      o[k[0]] = k[1]
    }
  } else {
    let [valueGenerator] = args
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
