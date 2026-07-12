// Completa la carta de cada restaurante (8 platos) y aplica los descuentos de campana.
// Es idempotente: solo crea los platos que faltan (por nombre + restaurante).
// Uso: node seeders/seedPlatos.js
const sequelize = require('../database');
const Menu = require('../models/Menu');
const Restaurante = require('../models/Restaurante');

const img = (seed) => `https://picsum.photos/seed/${seed}/500/300`;

// Platos nuevos por restaurante (los existentes no se tocan)
const PLATOS_NUEVOS = {
  'Maido': [
    { nombre: 'Tiradito Nikkei',        precio: 46.9, descripcion: 'Láminas de pescado blanco con leche de tigre al ají amarillo y toques de shoyu.' },
    { nombre: 'Gyozas de Cerdo',        precio: 32.5, descripcion: 'Empanadillas japonesas selladas al sartén, rellenas de cerdo y verduras.' },
    { nombre: 'Ramen Nikkei',           precio: 49.9, descripcion: 'Caldo tonkotsu con chashu de panceta, huevo marinado y ají limo.' },
    { nombre: 'Maki Acevichado',        precio: 39.9, descripcion: 'Rollo de langostino empanizado coronado con pesca del día en salsa acevichada.' },
    { nombre: 'Arroz Chaufa Nikkei',    precio: 44.5, descripcion: 'Arroz salteado al wok con mariscos, tortilla de huevo y cebolla china.' },
    { nombre: 'Mochi de Lúcuma',        precio: 24.9, descripcion: 'Masa de arroz rellena de helado artesanal de lúcuma.' },
  ],
  'Tanta': [
    { nombre: 'Lomo Saltado',           precio: 46.9, descripcion: 'Trozos de res salteados con cebolla, tomate y papas doradas.' },
    { nombre: 'Tacu Tacu con Sábana',   precio: 44.5, descripcion: 'Tacu tacu de frejol canario con bistec apanado y salsa criolla.' },
    { nombre: 'Arroz con Pollo',        precio: 36.9, descripcion: 'Arroz verde al culantro con pollo tierno y salsa huancaína.' },
    { nombre: 'Tallarines Verdes',      precio: 38.9, descripcion: 'Pasta en crema de albahaca y espinaca con bistec a la plancha.' },
    { nombre: 'Rocoto Relleno',         precio: 34.5, descripcion: 'Rocoto arequipeño relleno de carne, pasas y queso gratinado.' },
    { nombre: 'Picarones',              precio: 22.9, descripcion: 'Aros fritos de zapallo y camote bañados en miel de chancaca.' },
  ],
  'Cala': [
    { nombre: 'Tiradito de Atún',       precio: 44.9, descripcion: 'Atún fresco en corte fino con ponzu de maracuyá y ajonjolí.' },
    { nombre: 'Pulpo al Olivo',         precio: 48.5, descripcion: 'Láminas de pulpo con cremosa salsa de aceituna botija.' },
    { nombre: 'Conchas a la Parmesana', precio: 42.9, descripcion: 'Conchas de abanico gratinadas con mantequilla y parmesano.' },
    { nombre: 'Arroz Negro con Calamares', precio: 52.5, descripcion: 'Arroz en tinta de calamar con calamares crocantes y alioli.' },
    { nombre: 'Pesca del Día',          precio: 58.9, descripcion: 'Filete fresco a la plancha con puré rústico y salsa de mar.' },
    { nombre: 'Crema Volteada',         precio: 24.9, descripcion: 'Clásica crema volteada con caramelo dorado casero.' },
  ],
  'Amoramar': [
    { nombre: 'Ceviche Carretillero',   precio: 49.9, descripcion: 'Pesca del día con leche de tigre potente, cancha y chicharrón de calamar.' },
    { nombre: 'Causa de Cangrejo',      precio: 46.5, descripcion: 'Causa de papa amarilla coronada con pulpa de cangrejo y palta.' },
    { nombre: 'Chicharrón de Pescado',  precio: 44.9, descripcion: 'Trozos crocantes de pescado con yucas fritas y sarza criolla.' },
    { nombre: 'Arroz Meloso de Mariscos', precio: 56.5, descripcion: 'Arroz cremoso al ají panca con mariscos frescos de la bahía.' },
    { nombre: 'Pesca a la Brasa',       precio: 59.9, descripcion: 'Pescado entero a la parrilla con mantequilla de ají limo.' },
    { nombre: 'Suspiro de Maracuyá',    precio: 26.9, descripcion: 'Versión cítrica del clásico limeño con merengue al oporto.' },
  ],
  'Central': [
    { nombre: 'Valle Andino',           precio: 88.0, descripcion: 'Tubérculos nativos, quesos de altura y hierbas del valle sagrado.' },
    { nombre: 'Mar Profundo',           precio: 95.0, descripcion: 'Pesca de profundidad con algas, conchas y emulsión marina.' },
    { nombre: 'Desierto Costero',       precio: 82.0, descripcion: 'Ingredientes del desierto costero peruano en tres texturas.' },
  ],
  'Astrid & Gastón': [
    { nombre: 'Ají de Gallina Tradicional', precio: 58.0, descripcion: 'La receta clásica de la casa con ají mirasol y nueces.' },
    { nombre: 'Pato a la Norteña',      precio: 89.0, descripcion: 'Magret de pato con arroz verde norteño y sarza de cebolla.' },
    { nombre: 'Chocolate y Ají',        precio: 48.0, descripcion: 'Postre de chocolate peruano al 70% con un toque de ají charapita.' },
  ],
  'La Mar': [
    { nombre: 'Tiradito Carretillero',  precio: 52.0, descripcion: 'Corte fino de pesca del día con dos leches de tigre.' },
    { nombre: 'Arroz Chaufa de Mariscos', precio: 58.0, descripcion: 'Chaufa al wok con langostinos, calamar y conchas.' },
    { nombre: 'Pisco Sour de la Casa',  precio: 28.0, descripcion: 'El clásico de la barra con pisco quebranta y amargo de angostura.' },
  ],
  'Isolina': [
    { nombre: 'Tacu Tacu con Asado',    precio: 54.0, descripcion: 'Tacu tacu criollo con asado de tira al jugo de la casa.' },
    { nombre: 'Chicharrón de Costillas', precio: 56.0, descripcion: 'Costillas de cerdo confitadas y doradas con camote frito.' },
    { nombre: 'Arroz con Pato',         precio: 49.0, descripcion: 'Arroz al culantro y chicha de jora con pierna de pato.' },
  ],
};

// Descuentos de campana (restaurante -> plato -> %). No todos tienen oferta.
const DESCUENTOS = {
  'Maido':           { 'Sushi Acevichado': 20, 'Tiradito Nikkei': 15 },
  'Tanta':           { 'Lomo Saltado': 10 },
  'Central':         { 'Nixtamal': 15, 'Costa': 15 },
  'Astrid & Gastón': { 'Suspiro Limeño': 25 },
  'La Mar':          { 'Ceviche Mixto': 15, 'Leche de Tigre': 15, 'Jalea Mixta': 15 },
  'Isolina':         { 'Anticuchos': 20 },
};

// Platos agotados de demo
const AGOTADOS = {
  'Maido':  ['Lomo Saltado Nikkei'],
  'La Mar': ['Sudado de Mero'],
};

(async () => {
  try {
    const restaurantes = await Restaurante.findAll();
    let creados = 0, conDescuento = 0, agotados = 0;

    for (const rest of restaurantes) {
      const nuevos = PLATOS_NUEVOS[rest.nombre] || [];
      for (const plato of nuevos) {
        const existe = await Menu.findOne({ where: { restauranteId: rest.id, nombre: plato.nombre } });
        if (!existe) {
          const seed = plato.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          await Menu.create({ ...plato, restauranteId: rest.id, imagen: img(seed), stock: 10 });
          creados++;
        }
      }

      // stock base de 10 para lo que quedo sin stock
      await Menu.update({ stock: 10 }, { where: { restauranteId: rest.id, stock: null } });

      // descuentos
      const dsctos = DESCUENTOS[rest.nombre] || {};
      for (const [nombre, pct] of Object.entries(dsctos)) {
        const [n] = await Menu.update({ descuentoPct: pct }, { where: { restauranteId: rest.id, nombre } });
        if (n > 0) conDescuento++;
      }

      // agotados
      for (const nombre of (AGOTADOS[rest.nombre] || [])) {
        const [n] = await Menu.update({ stock: 0 }, { where: { restauranteId: rest.id, nombre } });
        if (n > 0) agotados++;
      }
    }

    console.log(`Platos creados: ${creados} | con descuento: ${conDescuento} | agotados demo: ${agotados}`);
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await sequelize.close();
  }
})();
