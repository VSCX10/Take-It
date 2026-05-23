const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./database');
const Usuario = require('./models/Usuario');
const Restaurante = require('./models/Restaurante');
const Menu = require('./models/Menu');        // ← aquí arriba
const authRoutes = require('./routes/auth');

const app = express();
const puerto = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Ruta restaurantes
app.get('/api/restaurantes', async (req, res) => {
  try {
    const restaurantes = await Restaurante.findAll();
    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener restaurantes' });
  }
});

// Ruta menú por restaurante
app.get('/api/restaurantes/:id/menu', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const platos = await Menu.findAll({ where: { restauranteId: id } });
    res.json(platos);
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener el menú' });
  }
});

// Conectar a PostgreSQL y sincronizar tablas
sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL conectado exitosamente');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Tablas sincronizadas');
    app.listen(puerto, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${puerto}`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    process.exit(1);
  });