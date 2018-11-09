<a name="module_build-object-better"></a>

### bob(...args)
The module exports a single function (referred to here as `bob`) that is used for building an object in various ways. Different signatures are available as described below.

In general, there are two ways to use the function: with one argument, or with two. With one argument, that argument fully specifies the properties
to create in the object, either as a sequence of key/value pairs, or else as a source object which is cloned.

With two arguments, the first argument is an iterable of property names ("keys"), and the second argument describes how to determine the
value for each property.

**Kind**: Exported function

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | See descriptions of different options below. |

<a name="module_build-object-better--module.exports.bob"></a>

#### `bob(keys, valueCalculator)`
Build an object from an iterable of property names and a function to generate corresponding values for each one.

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>Iterable.&lt;\*&gt;</code> | An iterable (e.g., an Array) describing the keys (i.e. property names) that your object will be given. |
| valueCalculator | <code>function(key:\*, idx:number, keys:Iterable):\*</code> | A function that is used to generate the values of your object's properties. It is invoked once for each of the provided keys, with the key itself, the index of the key in `keys`, and the complete `keys` iterable as arguments. |

<a name="module_build-object-better--module.exports.bob"></a>

#### `bob(keys, values)`
Build an object from a sequence of property names and corresponding property values.

**Kind**: static method of [<code>module.exports</code>](#exp_module_build-object-better--module.exports)

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>Iterable.&lt;\*&gt;</code> | An iterable (e.g., an Array) describing the keys (i.e. property names) that your object will be given. |
| values | <code>Array.&lt;\*&gt;</code> | An array of property values for your object. These will be "zipped" with the provided keys, so the 3rd key in `keys` will be assigned the third element (index `2`) in `values`. |

<a name="module_build-object-better--module.exports.bob"></a>

#### `bob(keys, source)`
Build an object by copying a specified set of properties from another object.

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>Iterable.&lt;\*&gt;</code> | An iterable (e.g., an Array) describing the keys (i.e. property names) that your object will be given. |
| source | <code>Object</code> | An object from which property values will be copied. For each key in `keys`, the value for that property will be taken as the value of the property with the same name from this object. Note that this will walk the entire prototype chain as needed to find the property, and produce an `undefined` value for any missing properties. |

<a name="module_build-object-better--module.exports.bob"></a>

#### `bob(keys, value)`
Build an object with specified properties, all of which have the same value.

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>Iterable.&lt;\*&gt;</code> | An iterable (e.g., an Array) describing the keys (i.e. property names) that your object will be given. |
| value | <code><em>primitive</em></code> | A constant value that will be used as the value for all properties of your object. |

<a name="module_build-object-better--module.exports.bob"></a>

#### `bob(entries)`
Build an object from an iterable of entries, each giving the name and value of one property in the object (e.g., as returned by
`Object.entries`).

| Param | Type | Description |
| --- | --- | --- |
| entries | <code>Iterable&lt;(Array\|{key, value})&gt;</code> | An iterable of entries, each entry specifying both the name and value of a property for your object. Each entry can be an Array, or an object.<br />If an Array, then the first item (index 0) in the Array is the name of the property (the "key"), and the second item (index 1) is the property value.<br />If the entry is not an array, then it is assumed to be an Object with a "key" property specifying the property name, and a "value" property specifying its value. |

<a name="module_build-object-better--module.exports.bob"></a>

#### `bob(source)`
Build an object as a shallow-clone of another object. The returned object will have all the same _own_ properties as the provided
source, with the same value. Values are not cloned, but copied directly, thus non-primitive objects (such as Arrays and Objects)
will actually be references to the same in-memory value.

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Object</code> | The object to clone. |

