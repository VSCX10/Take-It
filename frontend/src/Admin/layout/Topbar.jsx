import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TITULO_AMBITO } from './navConfig';

function Topbar({ ambito, onToggleMobile }) {
  const { usuarioActual, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const salir = () => { cerrarSesion(); navigate('/login'); };
  const inicial = (usuarioActual?.nombre?.[0] || '?').toUpperCase();

  return (
    <header className="am-topbar">
      <button className="am-topbar-hamburguesa" onClick={onToggleMobile} aria-label="Abrir menú">
        <i className="ti ti-menu-2" />
      </button>

      <span className="am-topbar-titulo">{TITULO_AMBITO[ambito]}</span>

      <div className="am-topbar-usuario">
        <div className="am-topbar-avatar">{inicial}</div>
        <div className="am-topbar-datos">
          <span className="am-topbar-nombre">{usuarioActual?.nombre} {usuarioActual?.apellido}</span>
          <span className="am-topbar-email">{usuarioActual?.email}</span>
        </div>
        <button className="am-topbar-logout" onClick={salir} title="Cerrar sesión">
          <i className="ti ti-logout" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
