const Promocion = require('../models/Promocion');

class PromocionServicio {
    async obtenerPorRestaurante(restauranteId) {
        return await Promocion.findAll({ where: { restauranteId }, order: [['id', 'DESC']] });
    }

    async crear(datos) {
        return await Promocion.create(datos);
    }

    async buscarPorRestaurante(id, restauranteId) {
        return await Promocion.findOne({ where: { id, restauranteId } });
    }

    async actualizar(id, restauranteId, datos) {
        const promo = await this.buscarPorRestaurante(id, restauranteId);
        if (!promo) return null;
        await promo.update(datos);
        return promo;
    }

    async cambiarEstado(id, restauranteId, activa) {
        return await this.actualizar(id, restauranteId, { activa });
    }

    async eliminar(id, restauranteId) {
        const promo = await this.buscarPorRestaurante(id, restauranteId);
        if (!promo) return null;
        await promo.destroy();
        return true;
    }
}

module.exports = PromocionServicio;
