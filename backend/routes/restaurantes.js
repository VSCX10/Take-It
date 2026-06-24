const express = require('express');
const router = express.Router();
const ServicioFactory = require('../factories/ServicioFactory');
const ResponseFactory = require('../factories/ResponseFactory');

const servicio = ServicioFactory.crear('restaurante');

router.get('/', async (req, res) => {
    try {
        const restaurantes = await servicio.obtenerTodos();
        return ResponseFactory.exito(res, restaurantes, 'Restaurantes obtenidos');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener restaurantes');
    }
});

module.exports = router;