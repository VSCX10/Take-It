import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function PrivateRoute({ children }) {
  const { usuarioActual, cargando } = useAuth();

  if (cargando) return <div className="cargando-pantalla"><div className="spinner" /></div>;

  return usuarioActual ? children : <Navigate to="/login" />;
}

function destinoPorRol(rol) {
  if (rol === 'admin_general') return '/panel/general/dashboard';
  if (rol === 'admin_restaurante') return '/panel/restaurante/reservas';
  return '/inicio';
}

export function PublicRoute({ children }) {
  const { usuarioActual, cargando } = useAuth();

  if (cargando) return <div className="cargando-pantalla"><div className="spinner" /></div>;

  return !usuarioActual ? children : <Navigate to={destinoPorRol(usuarioActual.rol)} />;
}
