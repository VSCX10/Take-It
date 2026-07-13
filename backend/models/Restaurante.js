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
  horaApertura: {
    type: DataTypes.TIME,
    defaultValue: '14:00'
  },
  horaCierre: {
    type: DataTypes.TIME,
    defaultValue: '22:00'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
}, {
  tableName: 'restaurantes',
  timestamps: false
});

Restaurante.associate = (modelos) => {
  Restaurante.hasMany(modelos.Reserva, { foreignKey: 'restauranteId', as: 'reservas' });
  Restaurante.hasMany(modelos.Usuario, { foreignKey: 'restauranteId', as: 'administradores' });
  Restaurante.hasMany(modelos.Mesa, { foreignKey: 'restauranteId', as: 'mesas' });
  Restaurante.hasMany(modelos.Promocion, { foreignKey: 'restauranteId', as: 'promociones' });
};

module.exports = Restaurante;