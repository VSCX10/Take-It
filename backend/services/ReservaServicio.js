const Reserva = require('../models/Reserva');
const Restaurante = require('../models/Restaurante');

class ReservaServicio {
    async crear(datos) {
        return await Reserva.create(datos);
    }

    async obtenerPorUsuario(usuarioId) {
        return await Reserva.findAll({
            where: { usuarioId },
            include: [{ model: Restaurante, as: 'restaurante', attributes: ['nombre', 'img'] }],
            order: [['id', 'DESC']]
        });
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