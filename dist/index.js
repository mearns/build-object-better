function fromTwoArgs(source, valueSupplier) {
    const [elements, keys] = getKeysAndElements(source);
    return getValues(elements, keys, valueSupplier);
}
function getKeysAndElements(source) {
    if (isIterable(source)) {
        const elements = [];
        for (const e of source) {
            elements.push(e);
        }
        const keys = new Array(elements.length);
        for (let i = 0; i < elements.length; i++) {
            // this _should_ only happen if E extends string, but we can't really guarantee that the ObjectOf<V>
            // option in the KeyAndValueSource doesn't also have an iterator, and since this type erasure is just
            // as bad as Java's, we don't know what type it will return.
            keys[i] = String(elements[i]);
        }
        return [elements, keys];
    }
    else {
        const keys = Object.keys(source);
        const elements = new Array(keys.length);
        for (let i = 0; i < keys.length; i++) {
            elements[i] = source[keys[i]];
        }
        return [elements, keys];
    }
}
function fromThreeArgs(source, keySupplier, valueSupplier) {
    const elements = getElements(source);
    const keys = getKeys(elements, keySupplier);
    return getValues(elements, keys, valueSupplier);
}
function getElements(source) {
    return [...source];
}
function getValues(elements, keys, valueSupplier) {
    const obj = {};
    if (isValueFunc(valueSupplier)) {
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            obj[k] = valueSupplier(k, i, keys, elements[i], elements);
        }
    }
    else if (isValueArray(valueSupplier)) {
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            obj[k] = valueSupplier[i];
        }
    }
    else if (isPrimitive(valueSupplier)) {
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            obj[k] = valueSupplier;
        }
    }
    else {
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            obj[k] = valueSupplier[k];
        }
    }
    return obj;
}
function getKeys(elements, keySupplier) {
    const keys = new Array(elements.length);
    if (isKeyFunc(keySupplier)) {
        for (let i = 0; i < elements.length; i++) {
            const e = elements[i];
            const k = keySupplier(e, i, elements);
            keys[i] = k;
        }
    }
    else if (isKeyArray(keySupplier)) {
        for (let i = 0; i < elements.length; i++) {
            const e = elements[i];
            const k = keySupplier[i];
            keys[i] = k;
        }
    }
    else {
        // If we made it this far, keySupplier is an Objectof<string>,
        // which can only happen if E extends string, so we should be able
        // to use E as a string to index into keySupplier. However... typescript
        // can't deduce that far apparently. Maybe because it's also typed as possibly
        // being a never, though we know that's can't actually happen.
        for (let i = 0; i < elements.length; i++) {
            const e = elements[i];
            const k = keySupplier[e];
            keys[i] = k;
        }
    }
    return keys;
}
/*

 /$$$$$$$$ /$$     /$$ /$$$$$$$  /$$$$$$$$        /$$$$$$  /$$   /$$  /$$$$$$  /$$$$$$$  /$$$$$$$   /$$$$$$
|__  $$__/|  $$   /$$/| $$__  $$| $$_____/       /$$__  $$| $$  | $$ /$$__  $$| $$__  $$| $$__  $$ /$$__  $$
   | $$    \  $$ /$$/ | $$  \ $$| $$            | $$  \__/| $$  | $$| $$  \ $$| $$  \ $$| $$  \ $$| $$  \__/
   | $$     \  $$$$/  | $$$$$$$/| $$$$$         | $$ /$$$$| $$  | $$| $$$$$$$$| $$$$$$$/| $$  | $$|  $$$$$$
   | $$      \  $$/   | $$____/ | $$__/         | $$|_  $$| $$  | $$| $$__  $$| $$__  $$| $$  | $$ \____  $$
   | $$       | $$    | $$      | $$            | $$  \ $$| $$  | $$| $$  | $$| $$  \ $$| $$  | $$ /$$  \ $$
   | $$       | $$    | $$      | $$$$$$$$      |  $$$$$$/|  $$$$$$/| $$  | $$| $$  | $$| $$$$$$$/|  $$$$$$/
   |__/       |__/    |__/      |________/       \______/  \______/ |__/  |__/|__/  |__/|_______/  \______/

*/
function isKeyFunc(o) {
    return typeof o === "function";
}
function isKeyArray(o) {
    return Array.isArray(o);
}
function isValueArray(o) {
    return Array.isArray(o);
}
function isValueFunc(o) {
    return typeof o === "function";
}
function isPrimitive(o) {
    switch (typeof o) {
        case "string":
        case "number":
        case "boolean":
        case "bigint":
        case "symbol":
        case "undefined":
            return true;
        default:
            return o === null;
    }
}
function isIterable(o) {
    return typeof o[Symbol.iterator] === "function";
}
//# sourceMappingURL=index.js.map