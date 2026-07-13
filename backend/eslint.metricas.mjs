export default [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'tests/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
    },
    rules: {
      complexity: ['warn', { max: 4 }],
    },
  },
];
