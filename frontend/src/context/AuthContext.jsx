import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:3000/api/auth';

export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  const setUserWithFoto = (user) => {
    if (!user) { setUsuarioActual(null); return; }
    const foto = localStorage.getItem(`foto_${user.id}`);
    setUsuarioActual(foto ? { ...user, foto } : user);
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const usuario = localStorage.getItem('usuario');
      if (token && usuario && usuario !== 'undefined') {
        setUserWithFoto(JSON.parse(usuario));
      }
    } catch (error) {
      localStorage.clear();
    }
    setCargando(false);
  }, []);

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
    } catch (error) {
      console.error('Error en registro:', error);
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

      return { ok: true };
    } catch (error) {
      console.error('Error en login:', error);
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

  const actualizarFoto = (base64) => {
    if (!usuarioActual) return;
    localStorage.setItem(`foto_${usuarioActual.id}`, base64);
    setUsuarioActual(prev => ({ ...prev, foto: base64 }));
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