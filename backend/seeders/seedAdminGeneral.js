const Usuario = require('../models/Usuario');

const EMAIL = 'admingeneral@takeit.com';
const PASSWORD = 'AdminGeneral123!';

// Crea la cuenta del administrador general si no existe todavia (idempotente).
// Correo distinto del admin legado (admin@takeit.com) para no pisar esa cuenta.
async function seedAdminGeneral() {
    const existente = await Usuario.findOne({ where: { email: EMAIL } });
    if (existente) {
        if (existente.rol !== 'admin_general') await existente.update({ rol: 'admin_general' });
        return;
    }
    await Usuario.create({
        nombre: 'Admin',
        apellido: 'General',
        email: EMAIL,
        password: PASSWORD,
        rol: 'admin_general'
    });
    console.log(`Admin general creado -> correo: ${EMAIL} | contraseña: ${PASSWORD}`);
}

module.exports = seedAdminGeneral;
