const sequelize = require('../database');
const Restaurante = require('../models/Restaurante');
const Usuario = require('../models/Usuario');

class AdminGeneralServicio {
    // Crea el restaurante y su administrador juntos; si algo falla, revierte ambos
    async crearRestauranteConAdmin(datosRestaurante, datosAdmin) {
        return await sequelize.transaction(async (t) => {
            const restaurante = await Restaurante.create(datosRestaurante, { transaction: t });
            const admin = await Usuario.create({
                nombre: datosAdmin.nombre,
                apellido: datosAdmin.apellido || datosRestaurante.nombre,
                email: datosAdmin.email,
                password: datosAdmin.password,
                telefono: datosAdmin.telefono || '',
                rol: 'admin_restaurante',
                restauranteId: restaurante.id
            }, { transaction: t });
            return { restaurante, admin };
        });
    }
}

module.exports = AdminGeneralServicio;
