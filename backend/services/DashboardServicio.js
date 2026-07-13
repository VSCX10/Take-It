const Restaurante = require('../models/Restaurante');
const Usuario = require('../models/Usuario');
const Reserva = require('../models/Reserva');
const Promocion = require('../models/Promocion');

function hoyISO() {
    return new Date().toISOString().slice(0, 10);
}

class DashboardServicio {
    async obtenerResumen() {
        const [
            totalRestaurantes,
            totalAdministradores,
            totalReservas,
            reservasDelDia,
            restaurantesActivos,
            promocionesActivas
        ] = await Promise.all([
            Restaurante.count(),
            Usuario.count({ where: { rol: 'admin_restaurante' } }),
            Reserva.count(),
            Reserva.count({ where: { fecha: hoyISO() } }),
            Restaurante.count({ where: { activo: true } }),
            Promocion.count({ where: { activa: true } })
        ]);

        return {
            totalRestaurantes,
            totalAdministradores,
            totalReservas,
            reservasDelDia,
            restaurantesActivos,
            promocionesActivas
        };
    }
}

module.exports = DashboardServicio;
