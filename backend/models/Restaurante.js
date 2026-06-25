const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Restaurante = sequelize.define('Restaurante', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  img: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  descripcion: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  direccion: {
    type: DataTypes.STRING,
    defaultValue: null
  },
}, {
  tableName: 'restaurantes',
  timestamps: false
});

Restaurante.associate = (modelos) => {
  Restaurante.hasMany(modelos.Reserva, { foreignKey: 'restauranteId', as: 'reservas' });
};

module.exports = Restaurante;