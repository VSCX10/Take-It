const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../database');

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING,
    defaultValue: 'cliente'
  },
  foto: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  codigoRecuperacion: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  passwordPendiente: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  recuperacionExpira: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
  hooks: {
    beforeCreate: hashearPassword,
    beforeUpdate: hashearPassword
  }
});

async function hashearPassword(usuario) {
  if (usuario.changed('password')) {
    usuario.password = await bcrypt.hash(usuario.password, 10);
  }
}

Usuario.prototype.compararPassword = function (passwordIngresada) {
  return bcrypt.compare(passwordIngresada, this.password);
};

module.exports = Usuario;
