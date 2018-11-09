# build-object-better

A javascript package for building objects from their properties. Meant to be a replacement for all of your:

```javascript
const object = keys.reduce((o, k) => {
  o[k] = figureOutValue(k)
  return o
}, {})
```

Instead:

```javascript
const object = bob(keys, figureOutValue)
```
