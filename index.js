
module.exports = function buildObjectBetter (keys, valueGenerator) {
  const o = {}
  if (Array.isArray(valueGenerator)) {
    const values = valueGenerator
    valueGenerator = (k, i) => values[i]
  } else if (typeof valueGenerator !== 'function') {
    const source = valueGenerator
    valueGenerator = k => source[k]
  }
  let k
  let i = 0
  for (k of keys) {
    o[k] = valueGenerator(k, i, keys)
    i++
  }
  return o
}
