const express = require('express');
const router = express.Router();
const ServicioFactory = require('../factories/ServicioFactory');
const ResponseFactory = require('../factories/ResponseFactory');

const servicio = ServicioFactory.crear('restaurante');
const mesaServicio = ServicioFactory.crear('mesa');
const menuServicio = ServicioFactory.crear('menu');

router.get('/', async (req, res) => {
    try {
        const restaurantes = await servicio.obtenerTodos();
        return ResponseFactory.exito(res, restaurantes, 'Restaurantes obtenidos');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener restaurantes');
    }
});

// Promociones vigentes segun los descuentos reales de la carta
router.get('/promociones', async (req, res) => {
    try {
        const promos = await menuServicio.promociones();
        return ResponseFactory.exito(res, promos, 'Promociones obtenidas');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener promociones');
    }
});

router.get('/:id/disponibilidad', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { fecha } = req.query;
        const personas = parseInt(req.query.personas) || 1;

        if (!fecha) {
            return ResponseFactory.error(res, 'Falta la fecha', 400);
        }

        const slots = await mesaServicio.disponibilidad(id, fecha, personas);
        if (slots === null) {
            return ResponseFactory.noEncontrado(res, 'Restaurante no encontrado');
        }
        return ResponseFactory.exito(res, slots, 'Disponibilidad obtenida');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener disponibilidad');
    }
});

module.exports = router;