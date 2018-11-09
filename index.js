
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
  for (let i = 0; i < keys.length; i++) {
    k = keys[i]
    o[k] = valueGenerator(k, i, keys)
  }
  return o
}
