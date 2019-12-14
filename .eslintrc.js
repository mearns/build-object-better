module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "standard",
    "plugin:prettier/recommended"
  ],
  rules: {
    semi: [2, "always"],
    "no-extra-semi": 2,
    "semi-spacing": [2, { before: false, after: true }],
    "prettier/prettier": "error"
  }
};
