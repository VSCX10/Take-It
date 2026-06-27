const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./database');
const Usuario = require('./models/Usuario');
const Restaurante = require('./models/Restaurante');
const Menu = require('./models/Menu');
const Reserva = require('./models/Reserva');
const Mesa = require('./models/Mesa');

const seedMesas = require('./seeders/seedMesas');

const authRoutes = require('./routes/auth');
const restaurantesRoutes = require('./routes/restaurantes');
const reservasRoutes = require('./routes/reservas');
const menuRoutes = require('./routes/menu');
const usuariosRoutes = require('./routes/usuarios');

// Registrar asociaciones entre modelos
const modelos = { Usuario, Restaurante, Menu, Reserva };
Object.values(modelos).forEach(m => { if (m.associate) m.associate(modelos); });

const app = express();
const puerto = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/restaurantes', restaurantesRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/restaurantes', menuRoutes);
app.use('/api/usuarios', usuariosRoutes);





sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL conectado exitosamente');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Tablas sincronizadas');
    return seedMesas();
  })
  .then(() => {
    app.listen(puerto, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${puerto}`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    process.exit(1);
  });