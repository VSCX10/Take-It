const Restaurante = require('../models/Restaurante');
const Reserva = require('../models/Reserva');

function hoyISO() {
    return new Date().toISOString().slice(0, 10);
}

class DashboardServicio {
    async obtenerResumen() {
        const [totalRestaurantes, totalReservas, reservasDelDia, reservasPendientes] = await Promise.all([
            Restaurante.count(),
            Reserva.count(),
            Reserva.count({ where: { fecha: hoyISO() } }),
            Reserva.count({ where: { estado: 'pendiente' } })
        ]);

        return { totalRestaurantes, totalReservas, reservasDelDia, reservasPendientes };
    }
}

module.exports = DashboardServicio;
