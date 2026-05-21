import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:3000/api/auth';

export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al montar, verificar si hay token guardado
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    
    if (token && usuario) {
      setUsuarioActual(JSON.parse(usuario));
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

      // Guardar token y usuario
      localStorage.setItem('token', datos.token);
      localStorage.setItem('usuario', JSON.stringify(datos.usuario));
      setUsuarioActual(datos.usuario);

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

      // Guardar token y usuario
      localStorage.setItem('token', datos.token);
      localStorage.setItem('usuario', JSON.stringify(datos.usuario));
      setUsuarioActual(datos.usuario);

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