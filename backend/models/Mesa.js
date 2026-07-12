const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Mesa = sequelize.define('Mesa', {
  restauranteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  // disponible | ocupada | mantenimiento
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'disponible'
  }
}, {
  tableName: 'mesas',
  timestamps: false
});

Mesa.associate = (modelos) => {
  Mesa.belongsTo(modelos.Restaurante, { foreignKey: 'restauranteId', as: 'restaurante' });
};

module.exports = Mesa;
