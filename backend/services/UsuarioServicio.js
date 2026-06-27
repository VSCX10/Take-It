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