const tsPlugin = require('@typescript-eslint/eslint-plugin');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = [
  {
    ignores: ['dist/', 'publish/', 'node_modules/', 'api/', 'tests/', 'vitest.config.ts'],
  },
  ...tsPlugin.configs['flat/recommended'],
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'no-var': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'never', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: ['const', 'let', 'var', 'expression', 'import', 'export'], next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var', 'expression'], next: ['if', 'for', 'while', 'switch'] },
        { blankLine: 'always', prev: 'block-like', next: ['if', 'for', 'while', 'switch', 'return', 'block-like'] },
        { blankLine: 'always', prev: 'import', next: ['const', 'let', 'var', 'expression', 'if', 'export'] },
        { blankLine: 'always', prev: ['const', 'let', 'var', 'expression', 'block-like'], next: 'export' },
        { blankLine: 'always', prev: ['expression', 'block-like', 'if', 'for', 'while', 'switch', 'return', 'try'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: ['if', 'for', 'while', 'switch'], next: ['expression', 'const', 'let', 'var', 'return'] },
      ],
      'no-nested-ternary': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@stylistic/lines-between-class-members': ['warn', {
        enforce: [
          { blankLine: 'always', prev: '*', next: 'method' },
          { blankLine: 'always', prev: 'method', next: '*' },
        ],
      }, { exceptAfterSingleLine: true, exceptAfterOverload: true }],
    },
  },
];
