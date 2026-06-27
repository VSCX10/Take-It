const express = require('express');
const router = express.Router();
const ServicioFactory = require('../factories/ServicioFactory');
const ResponseFactory = require('../factories/ResponseFactory');

const servicio = ServicioFactory.crear('reserva');
const mesaServicio = ServicioFactory.crear('mesa');

router.post('/', async (req, res) => {
    try {
        const { usuarioId, restauranteId, fecha, hora, personas, total, metodoPago } = req.body;

        const mesa = await mesaServicio.asignarMesa(restauranteId, fecha, hora, personas);
        if (!mesa) {
            return ResponseFactory.error(res, 'No hay mesas disponibles para ese horario', 409);
        }

        const reserva = await servicio.crear({
            usuarioId, restauranteId, mesaId: mesa.id, fecha, hora, personas, total, metodoPago
        });
        return ResponseFactory.exito(res, reserva, 'Reserva creada', 201);
    } catch (error) {
        return ResponseFactory.error(res, 'Error al crear reserva');
    }
});

router.get('/:usuarioId', async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const reservas = await servicio.obtenerPorUsuario(usuarioId);
        return ResponseFactory.exito(res, reservas, 'Reservas obtenidas');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener reservas');
    }
});

router.patch('/:id/cancelar', async (req, res) => {
    try {
        const reserva = await servicio.cancelar(req.params.id);
        if (!reserva) return ResponseFactory.noEncontrado(res, 'Reserva no encontrada');
            return ResponseFactory.exito(res, reserva, 'Reserva cancelada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al cancelar reserva');
    }
});

module.exports = router;