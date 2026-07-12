import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Guard por rol: sin sesion -> /login, rol no permitido -> /acceso-denegado
export function AdminRoute({ roles, children }) {
  const { usuarioActual, cargando } = useAuth();

  if (cargando) return <div className="cargando-pantalla"><div className="spinner" /></div>;
  if (!usuarioActual) return <Navigate to="/login" />;
  if (!roles.includes(usuarioActual.rol)) return <Navigate to="/acceso-denegado" />;

  return children;
}
