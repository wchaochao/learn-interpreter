module.exports = {
  extends: 'eslint:recommended',
  env: {
    node: true,
    es6: true,
    browser: true
  },
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'nerver']
  }
}
