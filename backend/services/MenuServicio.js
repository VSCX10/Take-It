const { Op } = require('sequelize');
const Menu = require('../models/Menu');
const Restaurante = require('../models/Restaurante');

class MenuServicio {
    async obtenerPorRestaurante(restauranteId) {
        return await Menu.findAll({ where: { restauranteId } });
    }

    async promociones() {
        const platos = await Menu.findAll({
            where: { descuentoPct: { [Op.gt]: 0 } },
            order: [['descuentoPct', 'DESC']]
        });
        if (platos.length === 0) return [];

        const ids = [...new Set(platos.map(p => p.restauranteId))];
        const restaurantes = await Restaurante.findAll({ where: { id: ids } });

        return restaurantes.map(r => {
            const suyos = platos.filter(p => p.restauranteId === r.id);
            return {
                restauranteId: r.id,
                nombre: r.nombre,
                categoria: r.categoria,
                img: r.img,
                descuentoMax: Math.max(...suyos.map(p => p.descuentoPct)),
                platos: suyos.map(p => ({ nombre: p.nombre, descuentoPct: p.descuentoPct }))
            };
        }).sort((a, b) => b.descuentoMax - a.descuentoMax);
    }
}

module.exports = MenuServicio;
