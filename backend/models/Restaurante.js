const mongoose = require('mongoose');

const restauranteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    unique: true
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5
  },
  img: {
    type: String,
    default: null
  },
  descripcion: {
    type: String,
    default: null
  },
  direccion: {
    type: String,
    required: [true, 'La dirección es obligatoria']
  },
  telefono: {
    type: String,
    default: null
  },
  horarioApertura: {
    type: String,
    default: '11:00'
  },
  horarioCierre: {
    type: String,
    default: '23:00'
  },
  capacidad: {
    type: Number,
    default: 50
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Restaurante', restauranteSchema);