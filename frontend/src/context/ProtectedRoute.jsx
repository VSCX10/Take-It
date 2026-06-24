import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Ruta que requiere estar logueado
export function PrivateRoute({ children }) {
  const { usuarioActual, cargando } = useAuth();

  if (cargando) return <div>Cargando...</div>;

  return usuarioActual ? children : <Navigate to="/login" />;
}

// Ruta que requiere NO estar logueado
export function PublicRoute({ children }) {
  const { usuarioActual, cargando } = useAuth();

  if (cargando) return <div>Cargando...</div>;

  return !usuarioActual ? children : <Navigate to="/inicio" />;
}