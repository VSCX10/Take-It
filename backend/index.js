const express = require('express');
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const sequelize = require('./database');
const Usuario = require('./models/Usuario');
const Restaurante = require('./models/Restaurante');
const Menu = require('./models/Menu');
const Reserva = require('./models/Reserva');
const Favorito = require('./models/Favorito');
require('./models/Mesa');

const seedMesas = require('./seeders/seedMesas');

const authRoutes = require('./routes/auth');
const restaurantesRoutes = require('./routes/restaurantes');
const reservasRoutes = require('./routes/reservas');
const menuRoutes = require('./routes/menu');
const usuariosRoutes = require('./routes/usuarios');
const favoritosRoutes = require('./routes/favoritos');
const verificarToken = require('./middleware/verificarToken');

// Relaciones entre modelos
const modelos = { Usuario, Restaurante, Menu, Reserva, Favorito };
Object.values(modelos).forEach(m => { if (m.associate) m.associate(modelos); });

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' })); // margen para la foto de perfil en base64

// Rutas publicas (login/registro y catalogo de restaurantes)
app.use('/api/auth', authRoutes);
app.use('/api/restaurantes', restaurantesRoutes);
app.use('/api/restaurantes', menuRoutes);

// Rutas privadas: requieren sesion activa (JWT)
app.use('/api/reservas', verificarToken, reservasRoutes);
app.use('/api/usuarios', verificarToken, usuariosRoutes);
app.use('/api/favoritos', verificarToken, favoritosRoutes);


// Solo arranca un servidor cuando se ejecuta directo (node index.js).
// En Vercel el archivo se importa como funcion y este bloque no corre,
// por eso ahi no se sincroniza ni se vuelve a sembrar la base.
if (require.main === module) {
  const puerto = process.env.PORT || 3000;
  sequelize.authenticate()
    .then(() => sequelize.sync({ alter: true }))
    .then(() => seedMesas())
    .then(() => app.listen(puerto, () => {
      console.log(`Servidor corriendo en http://localhost:${puerto}`);
    }))
    .catch(err => {
      console.error('Error conectando a PostgreSQL:', err.message);
      process.exit(1);
    });
}

module.exports = app;