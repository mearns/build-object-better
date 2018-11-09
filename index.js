
module.exports = function buildObjectBetter (keys, valueGenerator) {
  const o = {}
  let k
  for (let i = 0; i < keys.length; i++) {
    k = keys[i]
    o[k] = valueGenerator(k, i, keys)
  }
  return o
}
