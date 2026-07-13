const sequelize = require('../database');
const Menu = require('../models/Menu');
const Restaurante = require('../models/Restaurante');

const img = (seed) => `https://picsum.photos/seed/${seed}/500/300`;

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
  'Panchita': [
    { nombre: 'Anticuchos de Corazón',  precio: 42.0, descripcion: 'Anticuchos a la brasa con papa dorada, choclo y crema de rocoto.' },
    { nombre: 'Seco de Cabrito',        precio: 52.0, descripcion: 'Cabrito al culantro con frejoles y arroz graneado.' },
    { nombre: 'Causa Rellena',          precio: 34.0, descripcion: 'Causa de papa amarilla rellena de pollo con palta.' },
    { nombre: 'Chicharrón de Cerdo',    precio: 48.0, descripcion: 'Chicharrón crocante con camote frito y sarza criolla.' },
    { nombre: 'Ají de Gallina',         precio: 38.0, descripcion: 'Clásico ají de gallina con papa y aceituna botija.' },
    { nombre: 'Mazamorra con Arroz',    precio: 18.0, descripcion: 'Clásico combinado de mazamorra morada y arroz con leche.' },
  ],
  'Osaka': [
    { nombre: 'Tiradito Ají Amarillo',  precio: 49.0, descripcion: 'Pesca blanca con salsa cremosa de ají amarillo y camote crocante.' },
    { nombre: 'Maki Furai',             precio: 44.0, descripcion: 'Rollo empanizado de salmón y queso crema con salsa de anguila.' },
    { nombre: 'Gohan de Mariscos',      precio: 56.0, descripcion: 'Arroz japonés salteado con mariscos y toque de wok.' },
    { nombre: 'Ceviche Osaka',          precio: 54.0, descripcion: 'Ceviche con leche de tigre al yuzu y toques nikkei.' },
    { nombre: 'Ramen del Mar',          precio: 52.0, descripcion: 'Ramen con caldo de mariscos, langostinos y ají limo.' },
    { nombre: 'Helado de Té Verde',     precio: 22.0, descripcion: 'Helado artesanal de matcha con crocante de ajonjolí.' },
  ],
  'Rafael': [
    { nombre: 'Ravioles de Osobuco',    precio: 58.0, descripcion: 'Pasta fresca rellena de osobuco braseado con demi-glace.' },
    { nombre: 'Atún en Costra',         precio: 62.0, descripcion: 'Atún sellado en costra de ajonjolí con puré de palta.' },
    { nombre: 'Risotto de Hongos',      precio: 54.0, descripcion: 'Risotto cremoso con hongos andinos y parmesano.' },
    { nombre: 'Asado de Tira',          precio: 68.0, descripcion: 'Costillar braseado por 12 horas con puré ahumado.' },
    { nombre: 'Pesca al Curry',         precio: 56.0, descripcion: 'Pesca del día con curry suave de coco y arroz jazmín.' },
    { nombre: 'Texturas de Chocolate',  precio: 28.0, descripcion: 'Postre de chocolate en tres texturas con helado de vainilla.' },
  ],
  'Siete Sopas': [
    { nombre: 'Sopa Criolla',           precio: 24.0, descripcion: 'Sopa de carne con fideos, leche, huevo pochado y pan frito.' },
    { nombre: 'Caldo de Gallina',       precio: 26.0, descripcion: 'Caldo reconfortante con presa de gallina, fideos y huevo.' },
    { nombre: 'Chupe de Camarones',     precio: 38.0, descripcion: 'Chupe arequipeño con camarones, choclo y queso fresco.' },
    { nombre: 'Aguadito de Pollo',      precio: 22.0, descripcion: 'Aguadito verde al culantro con pollo y arvejas.' },
    { nombre: 'Lomo Saltado',           precio: 36.0, descripcion: 'Lomo saltado al wok con papas fritas y arroz.' },
    { nombre: 'Arroz con Leche',        precio: 14.0, descripcion: 'Arroz con leche cremoso con canela y pasas.' },
  ],
};

const RESTAURANTES_NUEVOS = [
  { nombre: 'Panchita',    categoria: 'Criolla',              rating: 4.5, direccion: 'Av. 2 de Mayo 298, Miraflores',       descripcion: 'Sabores criollos de la tradición limeña en versión contemporánea.', img: img('panchita-restaurante') },
  { nombre: 'Osaka',       categoria: 'Nikkei',               rating: 4.7, direccion: 'Av. Pardo y Aliaga 660, San Isidro',  descripcion: 'Cocina nikkei de autor con producto del Pacífico.', img: img('osaka-restaurante') },
  { nombre: 'Rafael',      categoria: 'Fusión',               rating: 4.6, direccion: 'Calle San Martín 300, Miraflores',    descripcion: 'Alta cocina de fusión mediterránea y peruana.', img: img('rafael-restaurante') },
  { nombre: 'Siete Sopas', categoria: 'Peruana',              rating: 4.3, direccion: 'Av. Arequipa 2394, Lince',            descripcion: 'Sopas y clásicos peruanos las 24 horas.', img: img('sietesopas-restaurante') },
];

const DESCUENTOS = {
  'Maido':           { 'Sushi Acevichado': 20, 'Tiradito Nikkei': 15 },
  'Tanta':           { 'Lomo Saltado': 10 },
  'Central':         { 'Nixtamal': 15, 'Costa': 15 },
  'Astrid & Gastón': { 'Suspiro Limeño': 25 },
  'La Mar':          { 'Ceviche Mixto': 15, 'Leche de Tigre': 15, 'Jalea Mixta': 15 },
  'Isolina':         { 'Anticuchos': 20 },
  'Panchita':        { 'Anticuchos de Corazón': 15 },
  'Osaka':           { 'Maki Furai': 20 },
};

const AGOTADOS = {
  'Maido':  ['Lomo Saltado Nikkei'],
  'La Mar': ['Sudado de Mero'],
};

(async () => {
  try {
    for (const datos of RESTAURANTES_NUEVOS) {
      await Restaurante.findOrCreate({ where: { nombre: datos.nombre }, defaults: datos });
    }

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

      await Menu.update({ stock: 10 }, { where: { restauranteId: rest.id, stock: null } });

      const dsctos = DESCUENTOS[rest.nombre] || {};
      for (const [nombre, pct] of Object.entries(dsctos)) {
        const [n] = await Menu.update({ descuentoPct: pct }, { where: { restauranteId: rest.id, nombre } });
        if (n > 0) conDescuento++;
      }

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
