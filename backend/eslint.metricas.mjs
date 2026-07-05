// Config exclusiva para medir la complejidad ciclomatica del backend.
// Uso: npm run metricas
// Reporta la complejidad de cada funcion; sirve de evidencia para el
// analisis cuantitativo del release y para elegir el modulo de caja blanca (>4).
export default [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'tests/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
    },
    rules: {
      complexity: ['warn', { max: 0 }],
    },
  },
];
