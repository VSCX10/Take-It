// Crea (o repara) el usuario administrador.
// Uso: node scripts/crearAdmin.js
const sequelize = require('../database');
const Usuario = require('../models/Usuario');

const EMAIL = 'admin@takeit.com';
const PASSWORD = 'Admin123';

(async () => {
  try {
    let admin = await Usuario.findOne({ where: { email: EMAIL } });
    if (admin) {
      await Usuario.update({ rol: 'admin' }, { where: { id: admin.id } });
      console.log(`El usuario ${EMAIL} ya existia: rol admin asegurado.`);
    } else {
      admin = await Usuario.create({
        nombre: 'Admin',
        apellido: 'TakeIt',
        email: EMAIL,
        password: PASSWORD, // el hook del modelo la hashea
        rol: 'admin',
      });
      console.log(`Admin creado -> correo: ${EMAIL} | contraseña: ${PASSWORD}`);
    }
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await sequelize.close();
  }
})();
