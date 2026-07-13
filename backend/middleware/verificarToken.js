const jwt = require('jsonwebtoken');
const ResponseFactory = require('../factories/ResponseFactory');

function verificarToken(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        return ResponseFactory.noAutorizado(res, 'Debes iniciar sesión');
    }

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch {
        return ResponseFactory.noAutorizado(res, 'Sesión expirada, vuelve a iniciar sesión');
    }
}

module.exports = verificarToken;
