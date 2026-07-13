const UsuarioServicio = require('../services/UsuarioServicio');
const RestauranteServicio = require('../services/RestauranteServicio');
const ReservaServicio = require('../services/ReservaServicio');
const MenuServicio = require('../services/MenuServicio');
const MesaServicio = require('../services/MesaServicio');
const FavoritoServicio = require('../services/FavoritoServicio');
const PromocionServicio = require('../services/PromocionServicio');
const DashboardServicio = require('../services/DashboardServicio');
const AdminGeneralServicio = require('../services/AdminGeneralServicio');

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
            case 'favorito':
                return new FavoritoServicio();
            case 'promocion':
                return new PromocionServicio();
            case 'dashboard':
                return new DashboardServicio();
            case 'adminGeneral':
                return new AdminGeneralServicio();
            default:
                throw new Error(`Servicio ${tipo} no existe`);
        }
    }
}

module.exports = ServicioFactory;