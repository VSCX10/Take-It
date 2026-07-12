const express = require('express');
const router = express.Router();
const ServicioFactory = require('../../factories/ServicioFactory');
const ResponseFactory = require('../../factories/ResponseFactory');

const dashboardServicio = ServicioFactory.crear('dashboard');
const restauranteServicio = ServicioFactory.crear('restaurante');
const usuarioServicio = ServicioFactory.crear('usuario');
const adminGeneralServicio = ServicioFactory.crear('adminGeneral');

router.get('/dashboard', async (req, res) => {
    try {
        const resumen = await dashboardServicio.obtenerResumen();
        return ResponseFactory.exito(res, resumen, 'Resumen obtenido');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener el resumen');
    }
});

// ── Restaurantes ────────────────────────────────────────────────
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
        const { nombre, categoria, direccion, telefono, img, descripcion, correoAdmin, passwordAdmin, nombreAdmin } = req.body;
        if (!nombre || !categoria || !correoAdmin || !passwordAdmin) {
            return ResponseFactory.error(res, 'Faltan datos del restaurante o del administrador', 400);
        }
        const { restaurante, admin } = await adminGeneralServicio.crearRestauranteConAdmin(
            { nombre, categoria, direccion, telefono, img, descripcion },
            { nombre: nombreAdmin || nombre, email: correoAdmin, password: passwordAdmin }
        );
        return ResponseFactory.exito(res, { restaurante, admin: { id: admin.id, email: admin.email } }, 'Restaurante creado', 201);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return ResponseFactory.error(res, 'Ya existe un restaurante o correo con esos datos', 409);
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

// ── Administradores ─────────────────────────────────────────────
router.get('/administradores', async (req, res) => {
    try {
        const admins = await usuarioServicio.obtenerAdmins(req.query.q);
        return ResponseFactory.exito(res, admins, 'Administradores obtenidos');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al obtener administradores');
    }
});

router.put('/administradores/:id', async (req, res) => {
    try {
        const admin = await usuarioServicio.actualizarAdmin(req.params.id, req.body);
        if (!admin) return ResponseFactory.noEncontrado(res, 'Administrador no encontrado');
        return ResponseFactory.exito(res, admin, 'Administrador actualizado');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al actualizar el administrador');
    }
});

router.patch('/administradores/:id/estado', async (req, res) => {
    try {
        const admin = await usuarioServicio.cambiarEstadoUsuario(req.params.id, req.body.activo);
        if (!admin) return ResponseFactory.noEncontrado(res, 'Administrador no encontrado');
        return ResponseFactory.exito(res, admin, 'Estado actualizado');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al cambiar el estado');
    }
});

router.patch('/administradores/:id/password', async (req, res) => {
    try {
        const nuevaPassword = await usuarioServicio.resetPassword(req.params.id);
        if (!nuevaPassword) return ResponseFactory.noEncontrado(res, 'Administrador no encontrado');
        return ResponseFactory.exito(res, { password: nuevaPassword }, 'Contraseña restablecida');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al restablecer la contraseña');
    }
});

router.patch('/administradores/:id/restaurante', async (req, res) => {
    try {
        const admin = await usuarioServicio.asociarRestaurante(req.params.id, req.body.restauranteId);
        if (!admin) return ResponseFactory.noEncontrado(res, 'Administrador no encontrado');
        return ResponseFactory.exito(res, admin, 'Restaurante asociado');
    } catch (error) {
        return ResponseFactory.error(res, 'Error al asociar el restaurante');
    }
});

module.exports = router;
