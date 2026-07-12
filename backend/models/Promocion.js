const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Promocion = sequelize.define('Promocion', {
  restauranteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  // Base64 (mismo patron que la foto de perfil), sin subida de archivos
  imagen: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaFin: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'promociones',
  timestamps: false
});

Promocion.associate = (modelos) => {
  Promocion.belongsTo(modelos.Restaurante, { foreignKey: 'restauranteId', as: 'restaurante' });
};

module.exports = Promocion;
