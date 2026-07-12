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
  // 'cliente' | 'admin' (legado) | 'admin_general' | 'admin_restaurante'
  rol: {
    type: DataTypes.STRING,
    defaultValue: 'cliente'
  },
  // Solo para rol 'admin_restaurante': a que restaurante administra
  restauranteId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // Habilita/deshabilita el acceso de una cuenta administradora
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Foto de perfil en base64 (se guarda en la cuenta, no solo en el navegador)
  foto: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  // Datos temporales del cambio de contraseña pendiente de confirmar por correo
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

// Hashea la contraseña solo si cambió (registro o actualización)
async function hashearPassword(usuario) {
  if (usuario.changed('password')) {
    usuario.password = await bcrypt.hash(usuario.password, 10);
  }
}

Usuario.prototype.compararPassword = function (passwordIngresada) {
  return bcrypt.compare(passwordIngresada, this.password);
};

Usuario.associate = (modelos) => {
  Usuario.belongsTo(modelos.Restaurante, { foreignKey: 'restauranteId', as: 'restauranteAdmin' });
};

module.exports = Usuario;
