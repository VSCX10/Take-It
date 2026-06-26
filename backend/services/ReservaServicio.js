const Reserva = require('../models/Reserva');

class ReservaServicio {
    async crear(datos) {
        return await Reserva.create(datos);
    }

    async obtenerPorUsuario(usuarioId) {
        return await Reserva.findAll({ where: { usuarioId } });
    }

    async buscarPorId(id) {
        return await Reserva.findByPk(id);
    }

    async cancelar(id) {
        const reserva = await Reserva.findByPk(id);
        if (!reserva) return null;
        reserva.estado = 'cancelada';
        await reserva.save();
        return reserva;
    }
}

module.exports = ReservaServicio;