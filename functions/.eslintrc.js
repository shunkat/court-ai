module.exports = {
  'root': true,
  'env': {
    es6: true,
    node: true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  'ignorePatterns': [
    '/lib/**/*', // Ignore built files.
    '/generated/**/*', // Ignore generated files.
  ],
  'plugins': ['@typescript-eslint', 'import'],
  'rules': {
    'object-curly-spacing': ['error', 'always'],
    'import/no-unresolved': 0,
    'indent': ['error', 2],
    'valid-jsdoc': 'off',
    'max-len': ['error', { 'code': 200 }],
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    '@typescript-eslint/no-unused-vars': ['error', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'caughtErrorsIgnorePattern': '^_',
      'destructuredArrayIgnorePattern': '^_' }],
  },
};
