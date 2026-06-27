require('dotenv').config();
const sequelize = require('./database');
const Menu = require('./models/Menu');

async function seed() {
  await sequelize.authenticate();
  console.log('Conectado a Neon.');
  await sequelize.sync({ alter: true });
  console.log('Esquema sincronizado (columnas nuevas creadas si faltaban).');

  // Stock general: 10 unidades para todos los platos
  await Menu.update({ stock: 10 }, { where: {} });
  console.log('Stock base (10) aplicado a todos los platos.');

  // SOLD OUT: 1 plato agotado por restaurante
  await Menu.update({ stock: 0 }, { where: { id: [2, 11, 15, 22] } });
  console.log('Sold out: Lomo Saltado Nikkei, Alturas, Cochinillo, Sudado de Mero.');

  // Maido (id restaurante 1): Sushi Acevichado -> 20%
  await Menu.update({ descuentoPct: 20 }, { where: { id: 1 } });
  console.log('Maido: Sushi Acevichado -20%');

  // Central (id restaurante 5): Nixtamal + Costa -> 15%
  await Menu.update({ descuentoPct: 15 }, { where: { id: [9, 12] } });
  console.log('Central: Nixtamal y Costa -15%');

  // La Mar (id restaurante 7): Ceviche Mixto + Leche de Tigre + Jalea Mixta -> 15%
  await Menu.update({ descuentoPct: 15 }, { where: { id: [19, 20, 23] } });
  console.log('La Mar: Ceviche Mixto, Leche de Tigre, Jalea Mixta -15%');

  // Astrid & Gaston (id restaurante 6): Suspiro Limeno -> 100% (postre gratis)
  await Menu.update({ descuentoPct: 100 }, { where: { id: 18 } });
  console.log('Astrid & Gaston: Suspiro Limeno GRATIS (100%)');

  console.log('\nSeed completado exitosamente.');
  process.exit(0);
}

seed().catch(e => { console.error('Error en seed:', e.message); process.exit(1); });
