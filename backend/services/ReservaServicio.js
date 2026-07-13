const { Op } = require('sequelize');
const Reserva = require('../models/Reserva');
const Restaurante = require('../models/Restaurante');
const Usuario = require('../models/Usuario');

class ReservaServicio {
    async crear(datos) {
        return await Reserva.create(datos);
    }

    async buscarDuplicada(usuarioId, restauranteId, fecha, hora) {
        return await Reserva.findOne({
            where: { usuarioId, restauranteId, fecha, hora, estado: { [Op.ne]: 'cancelada' } }
        });
    }

    async obtenerPorUsuario(usuarioId) {
        return await Reserva.findAll({
            where: { usuarioId },
            include: [{ model: Restaurante, as: 'restaurante', attributes: ['nombre', 'img'] }],
            order: [['id', 'DESC']]
        });
    }

    async cancelar(id) {
        const reserva = await Reserva.findByPk(id);
        if (!reserva) return null;
        reserva.estado = 'cancelada';
        await reserva.save();
        return reserva;
    }

    async obtenerTodas({ fecha, estado, cliente } = {}) {
        const where = {};
        if (fecha) where.fecha = fecha;
        if (estado) where.estado = estado;

        const incluirUsuario = { model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido', 'email'] };
        if (cliente) incluirUsuario.where = { nombre: { [Op.iLike]: `%${cliente}%` } };

        return await Reserva.findAll({
            where,
            include: [
                { model: Restaurante, as: 'restaurante', attributes: ['nombre', 'img'] },
                incluirUsuario
            ],
            order: [['fecha', 'DESC'], ['hora', 'DESC']]
        });
    }

    async cambiarEstado(id, estado) {
        const reserva = await Reserva.findByPk(id);
        if (!reserva) return null;
        reserva.estado = estado;
        await reserva.save();
        return reserva;
    }
}

module.exports = ReservaServicio;
