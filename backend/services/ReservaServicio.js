const { Op } = require('sequelize');
const Reserva = require('../models/Reserva');
const Restaurante = require('../models/Restaurante');
const Usuario = require('../models/Usuario');

class ReservaServicio {
    async crear(datos) {
        return await Reserva.create(datos);
    }

    // Busca si el usuario ya tiene una reserva activa igual (mismo restaurante, fecha y hora)
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

    // Reservas con preorden a la espera del admin
    async obtenerPendientes() {
        return await Reserva.findAll({
            where: { estado: 'pendiente' },
            include: [
                { model: Restaurante, as: 'restaurante', attributes: ['nombre', 'img'] },
                { model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido', 'email'] }
            ],
            order: [['fecha', 'ASC'], ['hora', 'ASC']]
        });
    }

    async cambiarEstado(id, estado) {
        const reserva = await Reserva.findByPk(id);
        if (!reserva) return null;
        reserva.estado = estado;
        await reserva.save();
        return reserva;
    }

    // Panel del admin de restaurante: solo sus reservas, con filtros opcionales
    async obtenerPorRestaurante(restauranteId, { fecha, estado, cliente } = {}) {
        const where = { restauranteId };
        if (fecha) where.fecha = fecha;
        if (estado) where.estado = estado;

        const incluirUsuario = { model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido', 'email'] };
        if (cliente) incluirUsuario.where = { nombre: { [Op.iLike]: `%${cliente}%` } };

        return await Reserva.findAll({
            where,
            include: [incluirUsuario],
            order: [['fecha', 'DESC'], ['hora', 'DESC']]
        });
    }

    // Aisla por restaurante: nunca deja tocar una reserva ajena
    async buscarPorRestaurante(id, restauranteId) {
        return await Reserva.findOne({
            where: { id, restauranteId },
            include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido', 'email'] }]
        });
    }

    async actualizar(id, restauranteId, datos) {
        const reserva = await this.buscarPorRestaurante(id, restauranteId);
        if (!reserva) return null;
        await reserva.update(datos);
        return reserva;
    }

    async cambiarEstadoScoped(id, restauranteId, estado) {
        return await this.actualizar(id, restauranteId, { estado });
    }

    async eliminar(id, restauranteId) {
        const reserva = await this.buscarPorRestaurante(id, restauranteId);
        if (!reserva) return null;
        await reserva.destroy();
        return true;
    }
}

module.exports = ReservaServicio;