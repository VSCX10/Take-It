import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './routes/Login/Login.jsx';
import Registro from './routes/Register/Register.jsx';
import Inicio from './Main/Inicio.jsx';
import Perfil from './routes/Perfil/Perfil.jsx';
import ContenidoRestaurante from './routes/Pages/ContenidoRestaurante.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PrivateRoute, PublicRoute } from './context/ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Por defecto va al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login y Registro (solo sin sesión) */}
          <Route path="/login" element={
            <PublicRoute><Login /></PublicRoute>
          } />
          <Route path="/registro" element={
            <PublicRoute><Registro /></PublicRoute>
          } />

          {/* Inicio y detalle (solo con sesión) */}
          <Route path="/inicio" element={
            <PrivateRoute><Inicio /></PrivateRoute>
          } />
          <Route path="/contenido/:id" element={
            <PrivateRoute><ContenidoRestaurante /></PrivateRoute>
          } />
          <Route path="/perfil" element={
            <PrivateRoute><Perfil /></PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;