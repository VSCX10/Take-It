import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './routes/Login/Login.jsx';
import Registro from './routes/Register/Register.jsx'; 
import Inicio from './Main/Inicio.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;