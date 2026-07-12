const Favorito = require('../models/Favorito');
const Restaurante = require('../models/Restaurante');

class FavoritoServicio {
    async obtenerPorUsuario(usuarioId) {
        return await Favorito.findAll({
            where: { usuarioId },
            include: [{ model: Restaurante, as: 'restaurante' }],
            order: [['id', 'DESC']]
        });
    }

    async agregar(usuarioId, restauranteId) {
        const [favorito] = await Favorito.findOrCreate({
            where: { usuarioId, restauranteId }
        });
        return favorito;
    }

    async quitar(usuarioId, restauranteId) {
        return await Favorito.destroy({ where: { usuarioId, restauranteId } });
    }
}

module.exports = FavoritoServicio;
