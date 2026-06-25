const express = require('express');
const router = express.Router();
const ServicioFactory = require('../factories/ServicioFactory');
const ResponseFactory = require('../factories/ResponseFactory');

const servicio = ServicioFactory.crear('usuario');

router.put('/:id', async (req, res) => {
    try {
        const { nombre, apellido, telefono } = req.body;
        const actualizado = await servicio.actualizar(req.params.id, { nombre, apellido, telefono });
        if (!actualizado) return ResponseFactory.noEncontrado(res, 'Usuario no encontrado');
        return ResponseFactory.exito(res, {
            id: actualizado.id,
            nombre: actualizado.nombre,
            apellido: actualizado.apellido,
            email: actualizado.email,
            telefono: actualizado.telefono || ''
        }, 'Perfil actualizado');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al actualizar perfil');
    }
});

module.exports = router;
