const UsuarioServicio = require('../services/UsuarioServicio');
const RestauranteServicio = require('../services/RestauranteServicio');
const ReservaServicio = require('../services/ReservaServicio');
const MenuServicio = require('../services/MenuServicio');
const MesaServicio = require('../services/MesaServicio');

class ServicioFactory {
    static crear(tipo) {
        switch(tipo) {
            case 'usuario':
                return new UsuarioServicio();
            case 'restaurante':
                return new RestauranteServicio();
            case 'reserva':
                return new ReservaServicio();
            case 'menu':
                return new MenuServicio();
            case 'mesa':
                return new MesaServicio();
            default:
                throw new Error(`Servicio ${tipo} no existe`);
        }
    }
}

module.exports = ServicioFactory;