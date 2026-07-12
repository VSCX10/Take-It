const express = require('express');
const router = express.Router();
const ServicioFactory = require('../../factories/ServicioFactory');
const ResponseFactory = require('../../factories/ResponseFactory');

const reservaServicio = ServicioFactory.crear('reserva');
const mesaServicio = ServicioFactory.crear('mesa');
const promocionServicio = ServicioFactory.crear('promocion');
const resenaServicio = ServicioFactory.crear('resena');

// El restauranteId nunca viene del cliente: siempre del token del admin logueado
const miRestaurante = (req) => req.usuario.restauranteId;

// ── Reservas ─────────────────────────────────────────────────────
router.get('/reservas', async (req, res) => {
    try {
        const { fecha, estado, cliente } = req.query;
        const reservas = await reservaServicio.obtenerPorRestaurante(miRestaurante(req), { fecha, estado, cliente });
        return ResponseFactory.exito(res, reservas, 'Reservas obtenidas');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener reservas');
    }
});

router.get('/reservas/:id', async (req, res) => {
    try {
        const reserva = await reservaServicio.buscarPorRestaurante(req.params.id, miRestaurante(req));
        if (!reserva) return ResponseFactory.noEncontrado(res, 'Reserva no encontrada');
        return ResponseFactory.exito(res, reserva, 'Reserva obtenida');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener la reserva');
    }
});

router.put('/reservas/:id', async (req, res) => {
    try {
        const reserva = await reservaServicio.actualizar(req.params.id, miRestaurante(req), req.body);
        if (!reserva) return ResponseFactory.noEncontrado(res, 'Reserva no encontrada');
        return ResponseFactory.exito(res, reserva, 'Reserva actualizada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al actualizar la reserva');
    }
});

async function cambiarEstadoReserva(req, res, estado, mensaje) {
    try {
        const reserva = await reservaServicio.cambiarEstadoScoped(req.params.id, miRestaurante(req), estado);
        if (!reserva) return ResponseFactory.noEncontrado(res, 'Reserva no encontrada');
        return ResponseFactory.exito(res, reserva, mensaje);
    } catch (error) {
        return ResponseFactory.error(res, 'Error al cambiar el estado de la reserva');
    }
}

router.patch('/reservas/:id/confirmar', (req, res) => cambiarEstadoReserva(req, res, 'confirmada', 'Reserva confirmada'));
router.patch('/reservas/:id/completar', (req, res) => cambiarEstadoReserva(req, res, 'completada', 'Reserva completada'));
router.patch('/reservas/:id/cancelar', (req, res) => cambiarEstadoReserva(req, res, 'cancelada', 'Reserva cancelada'));

router.delete('/reservas/:id', async (req, res) => {
    try {
        const ok = await reservaServicio.eliminar(req.params.id, miRestaurante(req));
        if (!ok) return ResponseFactory.noEncontrado(res, 'Reserva no encontrada');
        return ResponseFactory.exito(res, null, 'Reserva eliminada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al eliminar la reserva');
    }
});

// ── Mesas ────────────────────────────────────────────────────────
router.get('/mesas', async (req, res) => {
    try {
        const mesas = await mesaServicio.obtenerPorRestaurante(miRestaurante(req));
        return ResponseFactory.exito(res, mesas, 'Mesas obtenidas');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener mesas');
    }
});

router.post('/mesas', async (req, res) => {
    try {
        const { capacidad, codigo } = req.body;
        if (!capacidad) return ResponseFactory.error(res, 'Falta la capacidad', 400);
        const mesa = await mesaServicio.crear({ restauranteId: miRestaurante(req), capacidad, codigo });
        return ResponseFactory.exito(res, mesa, 'Mesa creada', 201);
    } catch (error) {
        return ResponseFactory.error(res, 'Error al crear la mesa');
    }
});

router.put('/mesas/:id', async (req, res) => {
    try {
        const mesa = await mesaServicio.actualizar(req.params.id, miRestaurante(req), req.body);
        if (!mesa) return ResponseFactory.noEncontrado(res, 'Mesa no encontrada');
        return ResponseFactory.exito(res, mesa, 'Mesa actualizada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al actualizar la mesa');
    }
});

router.patch('/mesas/:id/estado', async (req, res) => {
    try {
        const mesa = await mesaServicio.cambiarEstado(req.params.id, miRestaurante(req), req.body.estado);
        if (!mesa) return ResponseFactory.noEncontrado(res, 'Mesa no encontrada');
        return ResponseFactory.exito(res, mesa, 'Estado actualizado');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al cambiar el estado de la mesa');
    }
});

router.delete('/mesas/:id', async (req, res) => {
    try {
        const ok = await mesaServicio.eliminar(req.params.id, miRestaurante(req));
        if (!ok) return ResponseFactory.noEncontrado(res, 'Mesa no encontrada');
        return ResponseFactory.exito(res, null, 'Mesa eliminada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al eliminar la mesa');
    }
});

// ── Promociones ──────────────────────────────────────────────────
router.get('/promociones', async (req, res) => {
    try {
        const promos = await promocionServicio.obtenerPorRestaurante(miRestaurante(req));
        return ResponseFactory.exito(res, promos, 'Promociones obtenidas');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener promociones');
    }
});

router.post('/promociones', async (req, res) => {
    try {
        const { titulo, descripcion, imagen, fechaInicio, fechaFin } = req.body;
        if (!titulo || !fechaInicio || !fechaFin) return ResponseFactory.error(res, 'Faltan datos de la promoción', 400);
        const promo = await promocionServicio.crear({ restauranteId: miRestaurante(req), titulo, descripcion, imagen, fechaInicio, fechaFin });
        return ResponseFactory.exito(res, promo, 'Promoción creada', 201);
    } catch (error) {
        return ResponseFactory.error(res, 'Error al crear la promoción');
    }
});

router.put('/promociones/:id', async (req, res) => {
    try {
        const promo = await promocionServicio.actualizar(req.params.id, miRestaurante(req), req.body);
        if (!promo) return ResponseFactory.noEncontrado(res, 'Promoción no encontrada');
        return ResponseFactory.exito(res, promo, 'Promoción actualizada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al actualizar la promoción');
    }
});

router.patch('/promociones/:id/estado', async (req, res) => {
    try {
        const promo = await promocionServicio.cambiarEstado(req.params.id, miRestaurante(req), req.body.activa);
        if (!promo) return ResponseFactory.noEncontrado(res, 'Promoción no encontrada');
        return ResponseFactory.exito(res, promo, 'Estado actualizado');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al cambiar el estado de la promoción');
    }
});

router.delete('/promociones/:id', async (req, res) => {
    try {
        const ok = await promocionServicio.eliminar(req.params.id, miRestaurante(req));
        if (!ok) return ResponseFactory.noEncontrado(res, 'Promoción no encontrada');
        return ResponseFactory.exito(res, null, 'Promoción eliminada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al eliminar la promoción');
    }
});

// ── Reseñas ──────────────────────────────────────────────────────
router.get('/resenas', async (req, res) => {
    try {
        const resenas = await resenaServicio.obtenerPorRestaurante(miRestaurante(req), req.query.q);
        return ResponseFactory.exito(res, resenas, 'Reseñas obtenidas');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener reseñas');
    }
});

router.patch('/resenas/:id/aprobar', async (req, res) => {
    try {
        const resena = await resenaServicio.cambiarEstado(req.params.id, miRestaurante(req), 'aprobada');
        if (!resena) return ResponseFactory.noEncontrado(res, 'Reseña no encontrada');
        return ResponseFactory.exito(res, resena, 'Reseña aprobada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al aprobar la reseña');
    }
});

router.patch('/resenas/:id/ocultar', async (req, res) => {
    try {
        const resena = await resenaServicio.cambiarEstado(req.params.id, miRestaurante(req), 'oculta');
        if (!resena) return ResponseFactory.noEncontrado(res, 'Reseña no encontrada');
        return ResponseFactory.exito(res, resena, 'Reseña ocultada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al ocultar la reseña');
    }
});

router.delete('/resenas/:id', async (req, res) => {
    try {
        const ok = await resenaServicio.eliminar(req.params.id, miRestaurante(req));
        if (!ok) return ResponseFactory.noEncontrado(res, 'Reseña no encontrada');
        return ResponseFactory.exito(res, null, 'Reseña eliminada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al eliminar la reseña');
    }
});

module.exports = router;
