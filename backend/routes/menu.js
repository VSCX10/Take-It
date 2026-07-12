const express = require('express');
const router = express.Router();
const ServicioFactory = require('../factories/ServicioFactory');
const ResponseFactory = require('../factories/ResponseFactory');

const servicio = ServicioFactory.crear('menu');

router.get('/:id/menu', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const platos = await servicio.obtenerPorRestaurante(id);
        return ResponseFactory.exito(res, platos, 'Menú obtenido');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener menú');
    }
});

module.exports = router;