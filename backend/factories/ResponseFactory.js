// Patrón Fábrica: crea respuestas HTTP estandarizadas
class ResponseFactory {
    static exito(res, data, mensaje = 'OK', codigo = 200) {
        return res.status(codigo).json({
            ok: true,
            mensaje,
            data
        });
}

    static error(res, mensaje = 'Error interno', codigo = 500) {
        return res.status(codigo).json({
            ok: false,
            mensaje
        });
    }

    static noEncontrado(res, mensaje = 'No encontrado') {
        return res.status(404).json({
            ok: false,
            mensaje
        });
    }

    static noAutorizado(res, mensaje = 'No autorizado') {
        return res.status(401).json({
            ok: false,
            mensaje
        });
    }
}

module.exports = ResponseFactory;