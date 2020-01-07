/* eslint-disable import/export */

/*
   /$$$                      /$$$
  /$$_/        /$$/$$       |_  $$
 /$$/         |  $$$/         \  $$
| $$          /$$$$$$$         | $$
| $$         |__ $$$_/         | $$
|  $$          /$$ $$          /$$/
 \  $$$       |__/__/        /$$$/
  \___/                     |___/
*/

/**
 * Create a new object as a shallow clone of the given object.
 * @param source The object to clone.
 */
export function buildObject<V>(source: {
  [key: string]: V | undefined;
}): { [key: string]: V | undefined };

/**
 * Create an object from an iterable of key-value pairs, each
 * pair defining one property in the created object.
 * @param entries The list of key-value pairs.
 */
export function buildObject<V>(
  entries: Iterable<[string, V]>
): { [key: string]: V | undefined };

/**
 * Create an object from an iterable of key-value pairs, each
 * pair defining one property in the created object.
 * @param entries The list of key-value pairs.
 */
export function buildObject<V>(
  entryObjects: Iterable<{ key: string; value: V }>
): { [key: string]: V | undefined };

/*
   /$$$        /$$$$$$  /$$                                 /$$      /$$$$$$   /$$$$$$   /$$ /$$$$$$$$ /$$                          /$$$
  /$$_/       /$$__  $$| $$                                | $$     /$$__  $$ /$$__  $$ /$$/| $$_____/|  $$           /$$/$$       |_  $$
 /$$/        | $$  \ $$| $$$$$$$  /$$  /$$$$$$   /$$$$$$$ /$$$$$$  | $$  \ $$| $$  \__//$$/ | $$       \  $$         |  $$$/         \  $$
| $$         | $$  | $$| $$__  $$|__/ /$$__  $$ /$$_____/|_  $$_/  | $$  | $$| $$$$   /$$/  | $$$$$     \  $$        /$$$$$$$         | $$
| $$         | $$  | $$| $$  \ $$ /$$| $$$$$$$$| $$        | $$    | $$  | $$| $$_/  |  $$  | $$__/      /$$/       |__ $$$_/         | $$
|  $$        | $$  | $$| $$  | $$| $$| $$_____/| $$        | $$ /$$| $$  | $$| $$     \  $$ | $$        /$$/          /$$ $$          /$$/
 \  $$$      |  $$$$$$/| $$$$$$$/| $$|  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$/| $$      \  $$| $$$$$$$$ /$$//$$       |__/__/        /$$$/
  \___/       \______/ |_______/ | $$ \_______/ \_______/   \___/   \______/ |__/       \__/|________/|__/| $/                     |___/
                            /$$  | $$                                                                     |_/
                           |  $$$$$$/
                            \______/
*/

/**
 * Create an object by transforming the property values of a source
 * object. The returned object has all the same property names as the `source`
 * object, but with (possibly) different values, as generated by the given
 * `valueFunc`.
 *
 * The `valueFunc` is invoked with each "key" (a property name
 * from the `source` object), the index of the property (based on iteration
 * order of the `source` object's properties), a list of _all_ the keys,
 * the corresponding "element" (property value) from the `source`, and a
 * list of _all_ the element values.
 *
 * Note that only the enumerable properties of the source object are
 * used.
 *
 * ```javascript
 * > buildObject(
 *  {a: "foo", b: "bar" },
 *  (k, i, ks, e) => `${k}-${e}`
 * )
 * { a: "a-foo", b: "b-bar" }
 * ```
 *
 * @param source The source object.
 * @param valueFunc A function that generates property values for the output
 * object.
 */
export function buildObject<E, V>(
  source: {
    [key: string]: E | undefined;
  },
  valueFunc: (
    key: string,
    index?: number,
    keys?: Iterable<string>,
    element?: E,
    elements?: Iterable<E>
  ) => V
): { [key: string]: V | undefined };

/**
 * Create an object by replacing the property values of a source
 * object with corresponding values from an array of values. The
 * returned object has all the same property names as the `source`
 * object, but with (possibly) different values, as provided by
 * the `values` array.
 *
 * The enumerable properties of the source object are iterated over
 * and paired with corresponding values from `values`; the property
 * values of the source object are ignored.
 *
 * ```javascript
 * > buildObject(
 *  {a: "foo", b: "bar" },
 *  ["one", "two", "ignored"]
 * )
 * { a: "one", b: "two" }
 * ```
 *
 * @param source The source object.
 * @param values The array of property values.
 */
export function buildObject<E, V>(
  source: {
    [key: string]: E | undefined;
  },
  values: V[]
): { [key: string]: V | undefined };

/**
 * Create an object by replacing the property values of a source
 * object with corresponding values from another object.
 *
 * Note that only the enumerable properties of the source object are
 * used; the property values of the source object are ignored.
 *
 * ```javascript
 * > buildObject(
 *  {b: 1, d: 2},
 *  {e: 10, d: 20, c: 30, b: 40, a: 50 }
 * )
 * { b: 40, d: 20 }
 * ```
 *
 * @param source The source object.
 * @param valueSource The object from which property values are taken.
 */
export function buildObject<E, V>(
  source: {
    [key: string]: E | undefined;
  },
  valueSource: {
    [key: string]: V | undefined;
  }
): { [key: string]: V | undefined };

/**
 * Create an object by replacing the property value of every property
 * in a source object with the given fixed value.
 *
 * Note that only the enumerable properties of the source object are
 * used; the property values of the source object are ignored. This
 * only works for primitive typed values.
 *
 * ```javascript
 * > buildObject(
 *  {b: 1, d: 2},
 *  "the one and only"
 * )
 * { b: "the ony and only", d: "the one and only" }
 * ```
 *
 * @param source The source object.
 * @param fixedVal The value to use for every property.
 */
export function buildObject<E, V extends Primitive>(
  source: {
    [key: string]: E | undefined;
  },
  fixedVal: V
): { [key: string]: V | undefined };

/*

   /$$$       /$$$$$$ /$$                                  /$$       /$$              /$$ /$$$$$$$$ /$$                          /$$$
  /$$_/      |_  $$_/| $$                                 | $$      | $$             /$$/| $$_____/|  $$           /$$/$$       |_  $$
 /$$/          | $$ /$$$$$$    /$$$$$$   /$$$$$$  /$$$$$$ | $$$$$$$ | $$  /$$$$$$   /$$/ | $$       \  $$         |  $$$/         \  $$
| $$           | $$|_  $$_/   /$$__  $$ /$$__  $$|____  $$| $$__  $$| $$ /$$__  $$ /$$/  | $$$$$     \  $$        /$$$$$$$         | $$
| $$           | $$  | $$    | $$$$$$$$| $$  \__/ /$$$$$$$| $$  \ $$| $$| $$$$$$$$|  $$  | $$__/      /$$/       |__ $$$_/         | $$
|  $$          | $$  | $$ /$$| $$_____/| $$      /$$__  $$| $$  | $$| $$| $$_____/ \  $$ | $$        /$$/          /$$ $$          /$$/
 \  $$$       /$$$$$$|  $$$$/|  $$$$$$$| $$     |  $$$$$$$| $$$$$$$/| $$|  $$$$$$$  \  $$| $$$$$$$$ /$$//$$       |__/__/        /$$$/
  \___/      |______/ \___/   \_______/|__/      \_______/|_______/ |__/ \_______/   \__/|________/|__/| $/                     |___/
                                                                                                       |_/
*/

/**
 * Creates an object from a list (or other iterable) of "keys" (property values)
 * and a function which generates the property values.
 *
 * The `valueFunc` is invoked with each "key" (a property name
 * from the `source` object), the index of the property (based on iteration
 * order of the `source` object's properties), a list of _all_ the keys,
 * the corresponding "element" (property value) from the `source`, and a
 * list of _all_ the element values. In this case, the keys and the elements
 * are identical.
 *
 * Note that only the enumerable properties of the source object are
 * used.
 *
 * ```javascript
 * > buildObject(
 *  ["a", "b"],
 *  (k, i, ks, e) => `${k}-${e}`
 * )
 * { a: "a-a", b: "b-b" }
 * ```
 *
 * @param keys The iterable of keys (property names).
 * @param valueFunc A function that generates property values for the output
 * object.
 */
export function buildObject<E extends string, V>(
  keys: Iterable<E>,
  valueFunc: (
    key: string,
    index?: number,
    keys?: Iterable<string>,
    element?: E,
    elements?: Iterable<E>
  ) => V
): { [key: string]: V | undefined };

/**
 * Creates an object from a list (or other iterable) of "keys" (property values)
 * and a function which generates the property values.
 *
 * The `valueFunc` is invoked with each "key" (a property name
 * from the `source` object), the index of the property (based on iteration
 * order of the `source` object's properties), a list of _all_ the keys,
 * the corresponding "element" (property value) from the `source`, and a
 * list of _all_ the element values. In this case, the keys and the elements
 * are identical.
 *
 * Note that only the enumerable properties of the source object are
 * used.
 *
 * ```javascript
 * > buildObject(
 *  ["a", "b"],
 *  (k, i, ks, e) => `${k}-${e}`
 * )
 * { a: "a-a", b: "b-b" }
 * ```
 *
 * @param keys The iterable of keys (property names).
 * @param valueFunc A function that generates property values for the output
 * object.
 */
export function buildObject<E extends string, V>(
  keys: Iterable<E>,
  valueFunc: (
    key: string,
    index?: number,
    keys?: Iterable<string>,
    element?: E,
    elements?: Iterable<E>
  ) => V
): { [key: string]: V | undefined };

/**
 * Create an object by pairing corresponding elements from a list
 * of keys (property names) and a list of values. Any iterable can
 * be used in place of a list for the keys, but only an array can be
 * used for the values.
 *
 * ```javascript
 * > buildObject(
 *  ["a", "b"],
 *  ["one", "two", "ignored"]
 * )
 * { a: "one", b: "two" }
 * ```
 *
 * @param keys The keys (property names).
 * @param values The array of property values.
 */
export function buildObject<E extends string, V>(
  keys: Iterable<E>,
  values: V[]
): { [key: string]: V | undefined };

/**
 * Create an object by copying the specified properties from the
 * given object.
 *
 * ```javascript
 * > buildObject(
 *  ["b", "d"],
 *  {e: 10, d: 20, c: 30, b: 40, a: 50 }
 * )
 * { b: 40, d: 20 }
 * ```
 *
 * @param keys The keys (property names).
 * @param valueSource The object from which property values are taken.
 */
export function buildObject<E, V>(
  keys: Iterable<E>,
  valueSource: {
    [key: string]: V | undefined;
  }
): { [key: string]: V | undefined };

/**
 * Create an object with the named properties, all of whom share the
 * same primitive value.
 *
 * ```javascript
 * > buildObject(
 *  ["b", "d"],
 *  "the one and only"
 * )
 * { b: "the ony and only", d: "the one and only" }
 * ```
 * Note this only works for primitive typed values.
 *
 * @param keys The keys (property names).
 * @param fixedVal The value to use for every property.
 */
export function buildObject<E, V extends Primitive>(
  keys: Iterable<E>,
  fixedVal: V
): { [key: string]: V | undefined };

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

export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null;
