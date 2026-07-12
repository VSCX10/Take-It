import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AccesoDenegado.css';

function destinoPorRol(rol) {
  if (rol === 'admin_general') return '/panel/general/dashboard';
  if (rol === 'admin_restaurante') return '/panel/restaurante/reservas';
  return '/inicio';
}

function AccesoDenegado() {
  const navigate = useNavigate();
  const { usuarioActual } = useAuth();

  return (
    <div className="ad-pagina">
      <div className="ad-card">
        <i className="ti ti-lock" />
        <h1>Acceso denegado</h1>
        <p>No tienes permiso para ver esta sección.</p>
        <button onClick={() => navigate(destinoPorRol(usuarioActual?.rol))}>
          <i className="ti ti-arrow-left" /> Volver
        </button>
      </div>
    </div>
  );
}

export default AccesoDenegado;
