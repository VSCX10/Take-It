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
}

module.exports = UsuarioServicio;