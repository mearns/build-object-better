/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
/* eslint @typescript-eslint/ban-ts-ignore: 0 */

// Module under test
import bob from "../index";
// import bob from "build-object-better";

// Support
import { expect, use } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

use(sinonChai);

describe("The build-object-better package", () => {
  it("should throw an error when invoked with 4 args", () => {
    expect(() =>
      bob(
        // @ts-ignore
        [1, 2, 3],
        () => {
          /* empty */
        },
        () => {
          /* empty */
        },
        null
      )
    ).to.throw(Error, /incorrect number of arguments/i);
  });

  it("should throw an error when invoked with 0 args", () => {
    // @ts-ignore
    expect(() => bob()).to.throw(Error, /incorrect number of arguments/i);
  });

  describe("With a constant value key supplier", () => {
    it("should throw an error", () => {
      // @ts-ignore
      expect(() => bob([1, 2, 3], "key", "value")).to.throw(
        TypeError,
        /invalid key supplier/i
      );
    });
  });

  describe("with a source object and a value-supplier function", () => {
    testCall(
      "should use the keys and values of the source object",
      { a: "X", b: "Y", c: "Z" }, // source
      (k, i, keys, e, es) => [k, i, keys, e, es], // value-supplier
      {
        a: ["a", 0, ["a", "b", "c"], "X", ["X", "Y", "Z"]],
        b: ["b", 1, ["a", "b", "c"], "Y", ["X", "Y", "Z"]],
        c: ["c", 2, ["a", "b", "c"], "Z", ["X", "Y", "Z"]]
      }
    );
  });

  describe("with a key-supplier object and a value-supplier function", () => {
    testCall(
      "should use the object to select keys and suppliers for values of generated object",
      ["a", "b", "c", "d"], // iterable
      { a: "w", c: "y", d: "z", b: "x" }, // key supplier
      (k, i, keys, e, es) => [k, i, keys, e, es], // value supplier
      {
        w: ["w", 0, ["w", "x", "y", "z"], "a", ["a", "b", "c", "d"]],
        x: ["x", 1, ["w", "x", "y", "z"], "b", ["a", "b", "c", "d"]],
        y: ["y", 2, ["w", "x", "y", "z"], "c", ["a", "b", "c", "d"]],
        z: ["z", 3, ["w", "x", "y", "z"], "d", ["a", "b", "c", "d"]]
      }
    );
  });

  describe("with a key-supplier array and a value-supplier function", () => {
    testCall(
      "should use the array of keys and suppliers for values of generated object",
      ["a", "b", "c", "d"], // iterable
      ["w", "x", "y", "z"], // key supplier
      (k, i, keys, e, es) => [k, i, keys, e, es], // value supplier
      {
        w: ["w", 0, ["w", "x", "y", "z"], "a", ["a", "b", "c", "d"]],
        x: ["x", 1, ["w", "x", "y", "z"], "b", ["a", "b", "c", "d"]],
        y: ["y", 2, ["w", "x", "y", "z"], "c", ["a", "b", "c", "d"]],
        z: ["z", 3, ["w", "x", "y", "z"], "d", ["a", "b", "c", "d"]]
      }
    );
  });

  describe("with a key-supplier function and a value-supplier function", () => {
    testCall(
      "should use the suppliers for keys and values of generated object",
      ["a", "b", "c", "d"], // iterable
      (e, i, es) => `${e}-${i}-${es.join("_")}`, // Key supplier
      (k, i, keys, e, es) => [k, i, keys, e, es], // value supplier
      {
        "a-0-a_b_c_d": [
          "a-0-a_b_c_d",
          0,
          ["a-0-a_b_c_d", "b-1-a_b_c_d", "c-2-a_b_c_d", "d-3-a_b_c_d"],
          "a",
          ["a", "b", "c", "d"]
        ],
        "b-1-a_b_c_d": [
          "b-1-a_b_c_d",
          1,
          ["a-0-a_b_c_d", "b-1-a_b_c_d", "c-2-a_b_c_d", "d-3-a_b_c_d"],
          "b",
          ["a", "b", "c", "d"]
        ],
        "c-2-a_b_c_d": [
          "c-2-a_b_c_d",
          2,
          ["a-0-a_b_c_d", "b-1-a_b_c_d", "c-2-a_b_c_d", "d-3-a_b_c_d"],
          "c",
          ["a", "b", "c", "d"]
        ],
        "d-3-a_b_c_d": [
          "d-3-a_b_c_d",
          3,
          ["a-0-a_b_c_d", "b-1-a_b_c_d", "c-2-a_b_c_d", "d-3-a_b_c_d"],
          "d",
          ["a", "b", "c", "d"]
        ]
      }
    );

    it("should pass the supplied key value as the first argument to the value-supplier", () => {
      const keySupplier = (e: string): string => e.toUpperCase();
      const valueSupplier = sinon.stub().returnsArg(0);
      const iterable = ["a", "b", "c", "d"];
      bob(iterable, keySupplier, valueSupplier);

      iterable.forEach(e => {
        expect(valueSupplier).to.have.been.calledWith(keySupplier(e));
      });
    });

    it("should pass the index as the second argument to the value-supplier", () => {
      const keySupplier = (e: string): string => e.toUpperCase();
      const valueSupplier = sinon.stub().returnsArg(0);
      const iterable = ["a", "b", "c", "d"];
      bob(iterable, keySupplier, valueSupplier);

      iterable.forEach((e, i) => {
        expect(valueSupplier).to.have.been.calledWith(keySupplier(e), i);
      });
    });

    it("should pass the entire key collection as the third argument to the value-supplier", () => {
      const keySupplier = (e: string): string => e.toUpperCase();
      const valueSupplier = sinon.stub().returnsArg(0);
      const iterable = ["a", "b", "c", "d"];
      const keys = iterable.map(keySupplier);
      bob(iterable, keySupplier, valueSupplier);

      iterable.forEach((e, i) => {
        expect(valueSupplier).to.have.been.calledWith(keySupplier(e), i, keys);
      });
    });

    it("should pass the iterable value as the fourth argument to the value-supplier", () => {
      const keySupplier = (e: string): string => e.toUpperCase();
      const valueSupplier = sinon.stub().returnsArg(0);
      const iterable = ["a", "b", "c", "d"];
      bob(iterable, keySupplier, valueSupplier);

      iterable.forEach((e, i) => {
        expect(valueSupplier).to.have.been.calledWith(
          keySupplier(e),
          i,
          sinon.match.any,
          e
        );
      });
    });

    it("should pass the entire iterable as the fifth argument to the value-supplier", () => {
      const keySupplier = (e: string): string => e.toUpperCase();
      const valueSupplier = sinon.stub().returnsArg(0);
      const iterable = ["a", "b", "c", "d"];
      bob(iterable, keySupplier, valueSupplier);

      iterable.forEach((e, i) => {
        expect(valueSupplier).to.have.been.calledWith(
          keySupplier(e),
          i,
          sinon.match.any,
          e,
          iterable
        );
      });
    });

    it("should pass the iterable value as the first argument to the key-supplier", () => {
      const keySupplier = sinon.stub().returnsArg(0);
      const valueSupplier = (): null => null;
      const iterable = ["a", "b", "c", "d"];
      bob(iterable, keySupplier, valueSupplier);

      iterable.forEach(e => {
        expect(keySupplier).to.have.been.calledWith(e);
      });
    });

    it("should pass the iterable index as the second argument to the key-supplier", () => {
      const keySupplier = sinon.stub().returnsArg(0);
      const valueSupplier = (): null => null;
      const iterable = ["a", "b", "c", "d"];
      bob(iterable, keySupplier, valueSupplier);

      iterable.forEach((e, i) => {
        expect(keySupplier).to.have.been.calledWith(e, i);
      });
    });

    it("should pass the iterable as the third argument to the key-supplier", () => {
      const keySupplier = sinon.stub().returnsArg(0);
      const valueSupplier = (): null => null;
      const iterable = ["a", "b", "c", "d"];
      bob(iterable, keySupplier, valueSupplier);

      expect(keySupplier)
        .to.have.been.calledWith(sinon.match.any, sinon.match.any, iterable)
        .with.callCount(iterable.length);
    });
  });

  describe("with an array of keys and a value generating function", () => {
    it("should pass the key as the first argument to the generating function", () => {
      // @ts-ignore
      const result = bob(["a", "b", "c"], k => k.toUpperCase());
      expect(result).to.deep.equal({
        a: "A",
        b: "B",
        c: "C"
      });
    });

    it("should pass the index of the key as the second argument to the generating function", () => {
      // @ts-ignore
      const result = bob(["a", "b", "c"], (k, i) => i);
      expect(result).to.deep.equal({
        a: 0,
        b: 1,
        c: 2
      });
    });

    it("should pass the array of keys as the third argument to the generating function", () => {
      const result = bob(
        // @ts-ignore
        ["a", "b", "c"],
        (k, i, keys) => `${i}-${keys.join("-")}`
      );
      expect(result).to.deep.equal({
        a: "0-a-b-c",
        b: "1-a-b-c",
        c: "2-a-b-c"
      });
    });
  });

  describe("with an array of keys, and an array of values", () => {
    it("should use keys as keys and values as values", () => {
      // @ts-ignore
      const result = bob(["a", "b", "c"], ["alpha", "bravo", "charlie"]);
      expect(result).to.deep.equal({
        a: "alpha",
        b: "bravo",
        c: "charlie"
      });
    });
  });

  describe("with an array of keys, and an object of values", () => {
    it("should use keys as keys, and select the same properties from the given source object as the values", () => {
      // @ts-ignore
      const result = bob(["a", "c", "d"], {
        b: "Banana",
        0: "Zero",
        a: "Apple",
        d: "Data",
        c: "Cookie",
        e: "Eggs"
      });
      expect(result).to.deep.equal({
        a: "Apple",
        c: "Cookie",
        d: "Data"
      });
    });
  });

  describe("Using other iterables of keys", () => {
    testCall(
      "should support a string as the keys",
      "abcd",
      { a: "Alpha", c: "Cookie", d: "Donut" },
      {
        a: "Alpha",
        b: undefined,
        c: "Cookie",
        d: "Donut"
      }
    );

    testCall(
      "should support a TypedArray of keys",
      new Uint8Array([0x00, 0x7f, 0xff]),
      ["first", "second", "third"],
      {
        "0": "first",
        "127": "second",
        "255": "third"
      }
    );

    testCall(
      "should support a Set of keys",
      new Set(["a", "a", "b", "d", "b", "c"]),
      (k, i) => `${k}-${i}`,
      {
        a: "a-0",
        b: "b-1",
        d: "d-2",
        c: "c-3"
      }
    );
    (function(...args): void {
      testCall(
        "should support an arguments object of keys",
        args,
        (k, i) => `${k.toUpperCase()}-${i + 1}`,
        {
          a: "A-1",
          c: "C-2",
          b: "B-3",
          f: "F-4"
        }
      );
      // @ts-ignore
    })("a", "c", "b", "f");

    testCall(
      "Should support an object with a Symbol.iterator function as the keys",
      {
        [Symbol.iterator]: () => {
          let i = 0;
          return {
            next: (): IteratorResult<number> => {
              if (i < 3) {
                return { value: i++, done: false };
              }
              return { value: undefined, done: true };
            }
          };
        }
      },
      ["un", "deux", "trois"],
      {
        0: "un",
        1: "deux",
        2: "trois"
      }
    );
  });

  describe("when a primitive is given as the second argument", () => {
    testCall(
      "should use a string value as the value for all properties",
      [1, 2, 3, 4],
      "my-value",
      {
        1: "my-value",
        2: "my-value",
        3: "my-value",
        4: "my-value"
      }
    );
  });

  describe("with an empty iterable and a value supplier", () => {
    testCall(
      "should return an empty object",
      [],
      () => "any value in a void",
      {}
    );
  });

  describe("with a single argument which is an empty iterable", () => {
    testCall("should return an empty object", [], {});
  });

  describe("with a single argument which is an iterable", () => {
    testCall(
      "elements which are arrays should be used as key, value pairs in that order",
      [
        ["a", "Alpha"],
        ["b", "Bravo"],
        ["c", "Charlie"]
      ],
      {
        a: "Alpha",
        b: "Bravo",
        c: "Charlie"
      }
    );

    testCall(
      'elements which Objects but not arrays should provide "key" and "value" properties',
      [
        { key: "a", value: "alpha" },
        { key: "c", value: "charles" }
      ],
      {
        a: "alpha",
        c: "charles"
      }
    );
  });

  describe("with a single argument, which is an object", () => {
    it("should shallowly clone the object", () => {
      const deepValue = [1, 2, 3, 4];
      const testObject = { 1: "one", 2: "two", 3: deepValue };
      const result = bob(testObject);

      expect(result).to.deep.equal({
        1: "one",
        2: "two",
        3: deepValue
      });
      expect(result !== testObject);
      expect(result[3] === deepValue);
    });
  });
});

function testCall(should, ...args): void {
  const callArgs = args.slice(0, args.length - 1);
  const expected = args[args.length - 1];
  it(should, () => {
    // @ts-ignore
    const result = bob(...callArgs);
    expect(result).to.deep.equal(expected);
  });
}
