const ResponseFactory = require('../factories/ResponseFactory');

// Se usa despues de verificarToken: solo deja pasar a los administradores
function verificarAdmin(req, res, next) {
    if (req.usuario && req.usuario.rol === 'admin') {
        return next();
    }
    return ResponseFactory.error(res, 'Solo el administrador puede entrar aquí', 403);
}

module.exports = verificarAdmin;
