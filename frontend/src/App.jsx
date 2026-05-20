import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './routes/Login/Login.jsx';
import Registro from './routes/Register/Register.jsx';
import Inicio from './Main/Inicio.jsx';

function RutaProtegida({ children }) {
  const { usuarioActual } = useAuth();
  return usuarioActual ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;