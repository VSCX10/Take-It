const Usuario = require('../models/Usuario');

const EMAIL = 'admin@takeit.com';
const PASSWORD = 'Admin123';

// Asegura que exista un unico administrador (rol admin_general).
// Idempotente: si ya existe, solo garantiza el rol correcto.
async function seedAdminGeneral() {
    const existente = await Usuario.findOne({ where: { email: EMAIL } });
    if (existente) {
        if (existente.rol !== 'admin_general') await existente.update({ rol: 'admin_general' });
        return;
    }
    await Usuario.create({
        nombre: 'Admin',
        apellido: 'TakeIt',
        email: EMAIL,
        password: PASSWORD,
        rol: 'admin_general'
    });
    console.log(`Admin creado -> correo: ${EMAIL} | contraseña: ${PASSWORD}`);
}

module.exports = seedAdminGeneral;
