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
  }
}, {
  tableName: 'mesas',
  timestamps: false
});

module.exports = Mesa;
