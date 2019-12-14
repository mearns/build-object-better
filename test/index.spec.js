/* eslint-env mocha */
/* eslint @typescript-eslint/no-var-requires: 0 */

const bob = require("..");

const { expect } = require("chai");

describe("Build-object-better as a JS package", () => {
  it("should be the build-object function", () => {
    expect(typeof bob).to.equal("function");
    expect(bob).to.have.property("name", "buildObject");
  });

  it("should work correctly", () => {
    expect(
      bob(
        [{ x: "a" }, { x: "b" }, { x: "c" }],
        e => e.x,
        k => `-${k.toUpperCase()}-`
      )
    ).to.deep.equal({
      a: "-A-",
      b: "-B-",
      c: "-C-"
    });
  });
});
