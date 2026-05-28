const Restaurante = require('../models/Restaurante');

class RestauranteServicio {
    async obtenerTodos() {
        return await Restaurante.findAll();
    }

    async buscarPorId(id) {
        return await Restaurante.findByPk(id);
    }

    async crear(datos) {
        return await Restaurante.create(datos);
    }
}

module.exports = RestauranteServicio;