const express = require('express');
const router = express.Router();
const ServicioFactory = require('../../factories/ServicioFactory');
const ResponseFactory = require('../../factories/ResponseFactory');

const dashboardServicio = ServicioFactory.crear('dashboard');
const restauranteServicio = ServicioFactory.crear('restaurante');
const reservaServicio = ServicioFactory.crear('reserva');

router.get('/dashboard', async (req, res) => {
    try {
        const resumen = await dashboardServicio.obtenerResumen();
        return ResponseFactory.exito(res, resumen, 'Resumen obtenido');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener el resumen');
    }
});

router.get('/reservas', async (req, res) => {
    try {
        const reservas = await reservaServicio.obtenerTodas(req.query);
        return ResponseFactory.exito(res, reservas, 'Reservas obtenidas');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener las reservas');
    }
});

const cambiarEstadoReserva = (estado) => async (req, res) => {
    try {
        const reserva = await reservaServicio.cambiarEstado(req.params.id, estado);
        if (!reserva) return ResponseFactory.noEncontrado(res, 'Reserva no encontrada');
        return ResponseFactory.exito(res, reserva, 'Reserva actualizada');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al actualizar la reserva');
    }
};

router.patch('/reservas/:id/confirmar', cambiarEstadoReserva('confirmada'));
router.patch('/reservas/:id/completar', cambiarEstadoReserva('completada'));
router.patch('/reservas/:id/cancelar', cambiarEstadoReserva('cancelada'));

router.get('/restaurantes', async (req, res) => {
    try {
        const restaurantes = await restauranteServicio.buscar(req.query.q);
        return ResponseFactory.exito(res, restaurantes, 'Restaurantes obtenidos');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener restaurantes');
    }
});

router.post('/restaurantes', async (req, res) => {
    try {
        const { nombre, categoria, direccion, img, descripcion } = req.body;
        if (!nombre || !categoria) {
            return ResponseFactory.error(res, 'Nombre y categoría son obligatorios', 400);
        }
        const restaurante = await restauranteServicio.crear({ nombre, categoria, direccion, img, descripcion });
        return ResponseFactory.exito(res, restaurante, 'Restaurante creado', 201);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return ResponseFactory.error(res, 'Ya existe un restaurante con ese nombre', 409);
        }
        return ResponseFactory.error(res, 'Error al crear el restaurante');
    }
});

router.put('/restaurantes/:id', async (req, res) => {
    try {
        const restaurante = await restauranteServicio.actualizar(req.params.id, req.body);
        if (!restaurante) return ResponseFactory.noEncontrado(res, 'Restaurante no encontrado');
        return ResponseFactory.exito(res, restaurante, 'Restaurante actualizado');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al actualizar el restaurante');
    }
});

router.patch('/restaurantes/:id/estado', async (req, res) => {
    try {
        const restaurante = await restauranteServicio.cambiarEstado(req.params.id, req.body.activo);
        if (!restaurante) return ResponseFactory.noEncontrado(res, 'Restaurante no encontrado');
        return ResponseFactory.exito(res, restaurante, 'Estado actualizado');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al cambiar el estado');
    }
});

router.delete('/restaurantes/:id', async (req, res) => {
    try {
        const resultado = await restauranteServicio.eliminar(req.params.id);
        if (!resultado) return ResponseFactory.noEncontrado(res, 'Restaurante no encontrado');
        if (resultado.bloqueado) {
            return ResponseFactory.error(res, 'No se puede eliminar: el restaurante tiene reservas registradas', 409);
        }
        return ResponseFactory.exito(res, null, 'Restaurante eliminado');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al eliminar el restaurante');
    }
});

module.exports = router;
