const Menu = require('../models/Menu');

class MenuServicio {
    async obtenerPorRestaurante(restauranteId) {
        return await Menu.findAll({ where: { restauranteId } });
    }

    async crear(datos) {
        return await Menu.create(datos);
    }
}

module.exports = MenuServicio;