const { Op } = require('sequelize');
const Resena = require('../models/Resena');

class ResenaServicio {
    async obtenerPorRestaurante(restauranteId, q) {
        const where = { restauranteId };
        if (q) where[Op.or] = [{ comentario: { [Op.iLike]: `%${q}%` } }, { clienteNombre: { [Op.iLike]: `%${q}%` } }];
        return await Resena.findAll({ where, order: [['id', 'DESC']] });
    }

    async buscarPorRestaurante(id, restauranteId) {
        return await Resena.findOne({ where: { id, restauranteId } });
    }

    async cambiarEstado(id, restauranteId, estado) {
        const resena = await this.buscarPorRestaurante(id, restauranteId);
        if (!resena) return null;
        await resena.update({ estado });
        return resena;
    }

    async eliminar(id, restauranteId) {
        const resena = await this.buscarPorRestaurante(id, restauranteId);
        if (!resena) return null;
        await resena.destroy();
        return true;
    }
}

module.exports = ResenaServicio;
