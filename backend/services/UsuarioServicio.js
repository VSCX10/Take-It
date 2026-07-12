const { Op } = require('sequelize');
const Usuario = require('../models/Usuario');

// Campos sensibles que nunca deben viajar en las respuestas del panel admin
const SIN_SENSIBLES = { exclude: ['password', 'codigoRecuperacion', 'passwordPendiente', 'recuperacionExpira'] };

class UsuarioServicio {
    async buscarPorEmail(email) {
        return await Usuario.findOne({ where: { email } });
    }

    async crear(datos) {
        return await Usuario.create(datos);
    }

    async buscarPorId(id) {
        return await Usuario.findByPk(id);
    }

    async cambiarPassword(usuario, nuevaPassword) {
        usuario.password = nuevaPassword;
        return await usuario.save();
    }

    async guardarFoto(id, foto) {
        return await Usuario.update({ foto }, { where: { id } });
    }

    // Guarda el codigo y la nueva contraseña (ya hasheada) a la espera de confirmacion
    async guardarRecuperacion(id, codigo, passwordHasheada, expira) {
        return await Usuario.update(
            { codigoRecuperacion: codigo, passwordPendiente: passwordHasheada, recuperacionExpira: expira },
            { where: { id } }
        );
    }

    // Aplica la contraseña pendiente y limpia el codigo (hooks off: ya viene hasheada)
    async aplicarRecuperacion(usuario) {
        return await Usuario.update(
            { password: usuario.passwordPendiente, codigoRecuperacion: null, passwordPendiente: null, recuperacionExpira: null },
            { where: { id: usuario.id }, hooks: false }
        );
    }

    async actualizar(id, datos) {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return null;
        const campos = {};
        if (datos.nombre)   campos.nombre   = datos.nombre;
        if (datos.apellido) campos.apellido = datos.apellido;
        if (datos.telefono !== undefined) campos.telefono = datos.telefono;
        await usuario.update(campos);
        return usuario;
    }

    // Administradores de restaurante (panel general), con busqueda opcional por nombre/email
    async obtenerAdmins(q) {
        const where = { rol: 'admin_restaurante' };
        if (q) where[Op.or] = [{ nombre: { [Op.iLike]: `%${q}%` } }, { email: { [Op.iLike]: `%${q}%` } }];
        return await Usuario.findAll({ where, attributes: SIN_SENSIBLES, order: [['id', 'DESC']] });
    }

    async actualizarAdmin(id, datos) {
        const admin = await Usuario.findByPk(id);
        if (!admin) return null;
        const campos = {};
        if (datos.nombre)   campos.nombre   = datos.nombre;
        if (datos.apellido) campos.apellido = datos.apellido;
        if (datos.email)    campos.email    = datos.email;
        if (datos.telefono !== undefined) campos.telefono = datos.telefono;
        await admin.update(campos);
        return await Usuario.findByPk(id, { attributes: SIN_SENSIBLES });
    }

    async cambiarEstadoUsuario(id, activo) {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return null;
        await usuario.update({ activo });
        return await Usuario.findByPk(id, { attributes: SIN_SENSIBLES });
    }

    // Genera una password temporal y la devuelve en claro (una sola vez) para que el admin general la comparta
    async resetPassword(id) {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return null;
        const nuevaPassword = Math.random().toString(36).slice(-8) + 'A1!';
        usuario.password = nuevaPassword;
        await usuario.save();
        return nuevaPassword;
    }

    async asociarRestaurante(id, restauranteId) {
        const admin = await Usuario.findByPk(id);
        if (!admin) return null;
        await admin.update({ restauranteId });
        return await Usuario.findByPk(id, { attributes: SIN_SENSIBLES });
    }
}

module.exports = UsuarioServicio;