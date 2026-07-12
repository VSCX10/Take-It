const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Resena = sequelize.define('Resena', {
  restauranteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // Snapshot del nombre cuando no hay usuarioId (ej. reseña cargada manualmente)
  clienteNombre: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  calificacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  // pendiente | aprobada | oculta
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'resenas',
  timestamps: false
});

Resena.associate = (modelos) => {
  Resena.belongsTo(modelos.Restaurante, { foreignKey: 'restauranteId', as: 'restaurante' });
  Resena.belongsTo(modelos.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
};

module.exports = Resena;
