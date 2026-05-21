const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: { type: String, unique: true },
  telefono: { type: String, default: '' },
  password: String,
  avatar: { type: String, default: null },
  fechaRegistro: { type: Date, default: Date.now }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = function(passwordIngresada) {
  return passwordIngresada === this.password;
};

module.exports = mongoose.model('Usuario', usuarioSchema);