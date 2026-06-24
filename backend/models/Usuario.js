const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

Usuario.prototype.compararPassword = function(passwordIngresada) {
  return passwordIngresada === this.password;
};

module.exports = Usuario;