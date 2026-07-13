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
const Mesa = require('./models/Mesa');

const seedMesas = require('./seeders/seedMesas');
const seedAdminGeneral = require('./seeders/seedAdminGeneral');

const authRoutes = require('./routes/auth');
const restaurantesRoutes = require('./routes/restaurantes');
const reservasRoutes = require('./routes/reservas');
const menuRoutes = require('./routes/menu');
const usuariosRoutes = require('./routes/usuarios');
const favoritosRoutes = require('./routes/favoritos');
const panelGeneralRoutes = require('./routes/panel/general');
const verificarToken = require('./middleware/verificarToken');
const verificarRol = require('./middleware/verificarRol');

const modelos = { Usuario, Restaurante, Menu, Reserva, Favorito, Mesa };
Object.values(modelos).forEach(m => { if (m.associate) m.associate(modelos); });

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/restaurantes', restaurantesRoutes);
app.use('/api/restaurantes', menuRoutes);

app.use('/api/reservas', verificarToken, reservasRoutes);
app.use('/api/usuarios', verificarToken, usuariosRoutes);
app.use('/api/favoritos', verificarToken, favoritosRoutes);

app.use('/api/panel/general', verificarToken, verificarRol('admin_general'), panelGeneralRoutes);

if (require.main === module) {
  const puerto = process.env.PORT || 3000;
  sequelize.authenticate()
    .then(() => sequelize.sync({ alter: true }))
    .then(() => seedMesas())
    .then(() => seedAdminGeneral())
    .then(() => app.listen(puerto, () => {
      console.log(`Servidor corriendo en http://localhost:${puerto}`);
    }))
    .catch(err => {
      console.error('Error conectando a PostgreSQL:', err.message);
      process.exit(1);
    });
}

module.exports = app;
