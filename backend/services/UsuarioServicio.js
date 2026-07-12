const Usuario = require('../models/Usuario');

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
}

module.exports = UsuarioServicio;