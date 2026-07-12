// Config para medir complejidad ciclomatica: npm run metricas
// Lista las funciones con complejidad mayor a 4.
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
