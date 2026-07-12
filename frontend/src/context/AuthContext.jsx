import { createContext, useContext, useState } from 'react';
import { authHeaders } from '../utils/authHeaders';

const AuthContext = createContext(null);
const API_URL = '/api/auth';

export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const usuario = localStorage.getItem('usuario');
      if (token && usuario && usuario !== 'undefined') {
        const user = JSON.parse(usuario);
        const foto = user.foto || localStorage.getItem(`foto_${user.id}`);
        return foto ? { ...user, foto } : user;
      }
    } catch {
      localStorage.clear();
    }
    return null;
  });
  const [cargando] = useState(false);

  const setUserWithFoto = (user) => {
    if (!user) { setUsuarioActual(null); return; }
    const foto = user.foto || localStorage.getItem(`foto_${user.id}`);
    setUsuarioActual(foto ? { ...user, foto } : user);
  };

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
      setUserWithFoto(datos.data.usuario);

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
      setUserWithFoto(datos.data.usuario);

      return { ok: true, usuario: datos.data.usuario };
    } catch {
      return { ok: false, mensaje: 'Error de conexión' };
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuarioActual(null);
  };

  const actualizarPerfil = (nuevoDato) => {
    const merged = { ...usuarioActual, ...nuevoDato };
    localStorage.setItem('usuario', JSON.stringify(merged));
    setUsuarioActual(merged);
  };

  const actualizarFoto = async (base64) => {
    if (!usuarioActual) return;
    // Se muestra de una y se guarda en la cuenta (persiste en cualquier dispositivo)
    const merged = { ...usuarioActual, foto: base64 };
    setUsuarioActual(merged);
    localStorage.setItem('usuario', JSON.stringify(merged));
    try {
      await fetch(`/api/usuarios/${usuarioActual.id}/foto`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ foto: base64 }),
      });
    } catch {
      // si falla el guardado, al menos queda en esta sesion
    }
  };

  return (
    <AuthContext.Provider value={{ usuarioActual, registrar, iniciarSesion, cerrarSesion, actualizarPerfil, actualizarFoto, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}