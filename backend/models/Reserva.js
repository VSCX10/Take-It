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
  },
  metodoPago: {
    type: DataTypes.STRING,
    defaultValue: 'local'
  }
}, {
  tableName: 'reservas',
  timestamps: false
});

Reserva.associate = (modelos) => {
  Reserva.belongsTo(modelos.Restaurante, { foreignKey: 'restauranteId', as: 'restaurante' });
};

module.exports = Reserva;