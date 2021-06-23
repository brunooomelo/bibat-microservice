module.exports = {
  env: {
    commonjs: true,
    es2021: true,
  },
  extends: ['google', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'space-before-function-paren': 0,
    'prettier/prettier': 'error',
    'new-cap': 0,
  },
};
