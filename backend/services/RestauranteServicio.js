const { Op } = require('sequelize');
const Restaurante = require('../models/Restaurante');
const Reserva = require('../models/Reserva');

class RestauranteServicio {
    async obtenerTodos() {
        return await Restaurante.findAll({ where: { activo: true } });
    }

    async buscarPorId(id) {
        return await Restaurante.findByPk(id);
    }

    async crear(datos) {
        return await Restaurante.create(datos);
    }

    async buscar(q) {
        const where = q ? { nombre: { [Op.iLike]: `%${q}%` } } : {};
        return await Restaurante.findAll({ where, order: [['id', 'DESC']] });
    }

    async actualizar(id, datos) {
        const restaurante = await Restaurante.findByPk(id);
        if (!restaurante) return null;
        await restaurante.update(datos);
        return restaurante;
    }

    async cambiarEstado(id, activo) {
        return await this.actualizar(id, { activo });
    }

    async eliminar(id) {
        const tieneReservas = await Reserva.count({ where: { restauranteId: id } });
        if (tieneReservas > 0) return { bloqueado: true };
        const restaurante = await Restaurante.findByPk(id);
        if (!restaurante) return null;
        await restaurante.destroy();
        return { bloqueado: false };
    }
}

module.exports = RestauranteServicio;