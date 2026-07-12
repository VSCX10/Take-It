const express = require('express');
const router = express.Router();
const ServicioFactory = require('../factories/ServicioFactory');
const ResponseFactory = require('../factories/ResponseFactory');

const servicio = ServicioFactory.crear('favorito');

router.get('/:usuarioId', async (req, res) => {
    try {
        const favoritos = await servicio.obtenerPorUsuario(req.params.usuarioId);
        return ResponseFactory.exito(res, favoritos, 'Favoritos obtenidos');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener favoritos');
    }
});

router.post('/', async (req, res) => {
    try {
        const { usuarioId, restauranteId } = req.body;
        if (!usuarioId || !restauranteId) {
            return ResponseFactory.error(res, 'Faltan usuarioId o restauranteId', 400);
        }
        const favorito = await servicio.agregar(usuarioId, restauranteId);
        return ResponseFactory.exito(res, favorito, 'Favorito agregado', 201);
    } catch (error) {
        return ResponseFactory.error(res, 'Error al agregar favorito');
    }
});

router.delete('/:usuarioId/:restauranteId', async (req, res) => {
    try {
        await servicio.quitar(req.params.usuarioId, req.params.restauranteId);
        return ResponseFactory.exito(res, null, 'Favorito eliminado');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al eliminar favorito');
    }
});

module.exports = router;
