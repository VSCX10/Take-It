const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Favorito = sequelize.define('Favorito', {
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  restauranteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'favoritos',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['usuarioId', 'restauranteId'] }
  ]
});

Favorito.associate = (modelos) => {
  Favorito.belongsTo(modelos.Restaurante, { foreignKey: 'restauranteId', as: 'restaurante' });
};

module.exports = Favorito;
