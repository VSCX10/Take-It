import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(null);

  // Al montar, verificar si hay sesión activa
  useEffect(() => {
    const sesion = localStorage.getItem('sesion_activa');
    if (sesion) {
      setUsuarioActual(JSON.parse(sesion));
    }
  }, []);

  const registrar = (datosUsuario) => {
    const usuarios = JSON.parse(localStorage.getItem('takeandit_usuarios') || '[]');

    // Verificar que el correo no esté registrado
    const existe = usuarios.find(u => u.email === datosUsuario.email);
    if (existe) {
      return { ok: false, mensaje: 'Este correo ya está registrado.' };
    }

    const nuevoUsuario = {
      id: Date.now().toString(),
      nombre: datosUsuario.nombre,
      apellido: datosUsuario.apellido,
      email: datosUsuario.email,
      telefono: datosUsuario.telefono || '',
      password: datosUsuario.password, // En prod: hashear
      fechaRegistro: new Date().toISOString(),
      avatar: null,
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('takeandit_usuarios', JSON.stringify(usuarios));

    // Iniciar sesión automáticamente (sin la contraseña en sesión)
    const { password, ...sesionData } = nuevoUsuario;
    localStorage.setItem('sesion_activa', JSON.stringify(sesionData));
    setUsuarioActual(sesionData);

    return { ok: true };
  };

  const iniciarSesion = (email, password) => {
    const usuarios = JSON.parse(localStorage.getItem('takeandit_usuarios') || '[]');
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (!usuario) {
      return { ok: false, mensaje: 'Correo o contraseña incorrectos.' };
    }

    const { password: _, ...sesionData } = usuario;
    localStorage.setItem('sesion_activa', JSON.stringify(sesionData));
    setUsuarioActual(sesionData);

    return { ok: true };
  };

  const cerrarSesion = () => {
    localStorage.removeItem('sesion_activa');
    setUsuarioActual(null);
  };

  return (
    <AuthContext.Provider value={{ usuarioActual, registrar, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
