const express = require('express');
const router = express.Router();
const ServicioFactory = require('../factories/ServicioFactory');
const ResponseFactory = require('../factories/ResponseFactory');

const servicio = ServicioFactory.crear('reserva');

// Reservas con preorden que esperan la decision del admin
router.get('/reservas', async (req, res) => {
    try {
        const pendientes = await servicio.obtenerPendientes();
        return ResponseFactory.exito(res, pendientes, 'Reservas pendientes obtenidas');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener reservas pendientes');
    }
});

router.patch('/reservas/:id/confirmar', async (req, res) => {
    try {
        const reserva = await servicio.cambiarEstado(req.params.id, 'confirmada');
        if (!reserva) return ResponseFactory.noEncontrado(res, 'Reserva no encontrada');
        return ResponseFactory.exito(res, reserva, 'Reserva confirmada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al confirmar la reserva');
    }
});

router.patch('/reservas/:id/rechazar', async (req, res) => {
    try {
        const reserva = await servicio.cambiarEstado(req.params.id, 'cancelada');
        if (!reserva) return ResponseFactory.noEncontrado(res, 'Reserva no encontrada');
        return ResponseFactory.exito(res, reserva, 'Reserva rechazada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al rechazar la reserva');
    }
});

module.exports = router;
