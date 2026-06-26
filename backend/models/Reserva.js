const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Reserva = sequelize.define('Reserva', {
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  restauranteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mesaId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  personas: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'pendiente'
  },
  total: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'reservas',
  timestamps: false
});

module.exports = Reserva;