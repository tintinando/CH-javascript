module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "semi": ["error", "always", { "omitLastInOneLineBlock": false }],
    "semi-style": ["error", "last"],
    "no-extra-semi": ["error"],
    "semi-spacing": ["error", { "before": false, "after": true }]
  }
};
