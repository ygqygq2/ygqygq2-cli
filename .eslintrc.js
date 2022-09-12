module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended'],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
  },
  globals: {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "process": true
  }
}
