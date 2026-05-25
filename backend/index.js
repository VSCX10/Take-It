const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./database');
const Usuario = require('./models/Usuario');
const Restaurante = require('./models/Restaurante');
const Menu = require('./models/Menu');
const Reserva = require('./models/Reserva');
const authRoutes = require('./routes/auth');

const app = express();
const puerto = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas auth
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

// Crear reserva
app.post('/api/reservas', async (req, res) => {
  try {
    const { usuarioId, restauranteId, fecha, hora, personas, total } = req.body;
    const reserva = await Reserva.create({ usuarioId, restauranteId, fecha, hora, personas, total });
    res.status(201).json({ ok: true, reserva });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al crear reserva', error: error.message });
  }
});

// Obtener reservas de un usuario
app.get('/api/reservas/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const reservas = await Reserva.findAll({ where: { usuarioId } });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener reservas' });
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