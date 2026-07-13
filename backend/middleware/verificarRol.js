const ResponseFactory = require('../factories/ResponseFactory');

function verificarRol(...rolesPermitidos) {
    return function (req, res, next) {
        if (req.usuario && rolesPermitidos.includes(req.usuario.rol)) {
            return next();
        }
        return ResponseFactory.error(res, 'No tienes permiso para acceder a este recurso', 403);
    };
}

module.exports = verificarRol;
