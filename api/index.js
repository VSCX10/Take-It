// Wrapper para Vercel: importa la app Express y la expone como funcion serverless
const app = require('../backend/index');
module.exports = app;
