function fromTwoArgs<E, V>(
  source: KeyAndValueSource<E>,
  valueSupplier: ValueSupplier<E, V>
): ObjectOf<V> {
  const [elements, keys]: [E[], string[]] = getKeysAndElements(source);
  return getValues(elements, keys, valueSupplier);
}

function getKeysAndElements<E>(source: KeyAndValueSource<E>): [E[], string[]] {
  if (isKeyIterable(source)) {
    const elements: E[] = [];
    for (const e of source) {
      elements.push(e);
    }
    const keys: string[] = new Array(elements.length);
    for (let i = 0; i < elements.length; i++) {
      // XXX: Here.
      keys[i] = (elements[i] as unknown) as string;
    }
    return [elements, keys];
  }
}

function fromThreeArgs<E, V>(
  source: KeySource<E>,
  keySupplier: KeySupplier<E>,
  valueSupplier: ValueSupplier<E, V>
): ObjectOf<V> {
  const elements: E[] = getElements(source);
  const keys: string[] = getKeys(elements, keySupplier);
  return getValues(elements, keys, valueSupplier);
}

function getElements<E>(source: KeySource<E>): E[] {
  return [...source];
}

function getValues<E, V>(
  elements: E[],
  keys: string[],
  valueSupplier: ValueSupplier<E, V>
): ObjectOf<V> {
  const obj: ObjectOf<V> = {};
  if (isValueFunc(valueSupplier)) {
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      obj[k] = valueSupplier(k, i, keys, elements[i], elements);
    }
  } else if (isValueArray(valueSupplier)) {
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      obj[k] = valueSupplier[i];
    }
  } else if (isPrimitive(valueSupplier)) {
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      obj[k] = valueSupplier;
    }
  } else {
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      obj[k] = valueSupplier[k];
    }
  }
  return obj;
}

function getKeys<E>(elements: E[], keySupplier: KeySupplier<E>): string[] {
  const keys: string[] = new Array(elements.length);
  if (isKeyFunc(keySupplier)) {
    for (let i = 0; i < elements.length; i++) {
      const e = elements[i];
      const k = keySupplier(e, i, elements);
      keys[i] = k;
    }
  } else if (isKeyArray(keySupplier)) {
    for (let i = 0; i < elements.length; i++) {
      const e = elements[i];
      const k = keySupplier[i];
      keys[i] = k;
    }
  } else {
    for (let i = 0; i < elements.length; i++) {
      const e = elements[i];
      const k = keySupplier[(e as unknown) as string];
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

function isKeyFunc<E>(o: KeySupplier<E>): o is KeyFunc<E> {
  return typeof o === "function";
}

function isKeyArray<E>(o: KeySupplier<E>): o is string[] {
  return Array.isArray(o);
}

function isValueArray<E, V>(o: ValueSupplier<E, V>): o is V[] {
  return Array.isArray(o);
}

function isValueFunc<E, V>(o: ValueSupplier<E, V>): o is ValueFunc<E, V> {
  return typeof o === "function";
}

function isPrimitive<V extends Primitive>(o: V | ObjectOf<any>): o is V {
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

function isKeyIterable<E>(
  o: ObjectOf<E> | Iterable<string>
): o is Iterable<string> {
  return typeof o[Symbol.iterator] === "function";
}

/*

 /$$$$$$$$ /$$     /$$ /$$$$$$$  /$$$$$$$$  /$$$$$$
|__  $$__/|  $$   /$$/| $$__  $$| $$_____/ /$$__  $$
   | $$    \  $$ /$$/ | $$  \ $$| $$      | $$  \__/
   | $$     \  $$$$/  | $$$$$$$/| $$$$$   |  $$$$$$
   | $$      \  $$/   | $$____/ | $$__/    \____  $$
   | $$       | $$    | $$      | $$       /$$  \ $$
   | $$       | $$    | $$      | $$$$$$$$|  $$$$$$/
   |__/       |__/    |__/      |________/ \______/

 */

type Primitive = string | number | boolean | bigint | symbol | undefined | null;

/**
 * An object whose properties are of a specific type.
 */
type ObjectOf<V> = { [key: string]: V | undefined };

type KeySource<E> = Iterable<E>;

type KeyAndValueSource<E> =
  | ObjectOf<E>
  | (E extends string ? Iterable<E> : never);

type KeyFunc<E> = (e: E, i?: number, elements?: Iterable<E>) => string;

type KeySupplier<E> =
  | KeyFunc<E>
  | string[]
  | (E extends string ? ObjectOf<string> : never);

type ValueFunc<E, V> = (
  k: string,
  i?: number,
  keys?: Iterable<string>,
  e?: E,
  elements?: Iterable<E>
) => V;

type ValueSupplier<E, V> =
  | ValueFunc<E, V>
  | V[]
  | ObjectOf<V>
  | (V extends Primitive ? V : never);