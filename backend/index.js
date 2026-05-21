const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const puerto = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('✅ MongoDB conectado exitosamente');
    })
    .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
    });


app.get('/api/saludo', (req, res) => {
    res.json({ 
    mensaje: '¡Backend funcionando con MongoDB!',
    status: 'conectado'
    });
});

const restaurantes = [
  { 
    id: 1, 
    nombre: 'Maido', 
    categoria: 'Nikkei', 
    rating: 4.9, 
    img: 'https://picsum.photos/seed/maido/500/300'
  },
  { 
    id: 2, 
    nombre: 'Tanta', 
    categoria: 'Peruana', 
    rating: 4.6, 
    img: 'https://picsum.photos/seed/tanta/500/300'
  },
  { 
    id: 3, 
    nombre: 'Cala', 
    categoria: 'Pescados y Mariscos', 
    rating: 4.8, 
    img: 'https://picsum.photos/seed/cala/500/300'
  },
  { 
    id: 4, 
    nombre: 'Amoramar', 
    categoria: 'Contemporánea', 
    rating: 4.9, 
    img: 'https://picsum.photos/seed/amoramar/500/300'
  }
];

app.get('/api/restaurantes', (req, res) => {
    res.json(restaurantes);
});

app.listen(puerto, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${puerto}`);
});