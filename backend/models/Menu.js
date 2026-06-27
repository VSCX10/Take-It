const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Menu = sequelize.define('Menu', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  imagen: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  restauranteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descuentoPct: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'menu',
  timestamps: false
});

module.exports = Menu;