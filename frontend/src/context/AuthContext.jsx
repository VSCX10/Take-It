import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:3000/api/auth';

export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const usuario = localStorage.getItem('usuario');
      if (token && usuario && usuario !== 'undefined') {
        return JSON.parse(usuario);
      }
    } catch {
      localStorage.clear();
    }
    return null;
  });
  const [cargando] = useState(false);

  const registrar = async (datosUsuario) => {
    try {
      const respuesta = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosUsuario)
      });

      const datos = await respuesta.json();

      if (!datos.ok) {
        return { ok: false, mensaje: datos.mensaje };
      }

      localStorage.setItem('token', datos.data.token);
      localStorage.setItem('usuario', JSON.stringify(datos.data.usuario));
      setUsuarioActual(datos.data.usuario);

      return { ok: true };
    } catch {
      return { ok: false, mensaje: 'Error de conexión' };
    }
  };

  const iniciarSesion = async (email, password) => {
    try {
      const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const datos = await respuesta.json();

      if (!datos.ok) {
        return { ok: false, mensaje: datos.mensaje };
      }

      localStorage.setItem('token', datos.data.token);
      localStorage.setItem('usuario', JSON.stringify(datos.data.usuario));
      setUsuarioActual(datos.data.usuario);

      return { ok: true };
    } catch {
      return { ok: false, mensaje: 'Error de conexión' };
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuarioActual(null);
  };

  return (
    <AuthContext.Provider value={{ usuarioActual, registrar, iniciarSesion, cerrarSesion, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}