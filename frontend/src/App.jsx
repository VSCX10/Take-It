import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './routes/Login/Login.jsx';
import Registro from './routes/Register/Register.jsx';
import Recuperar from './routes/Recuperar/Recuperar.jsx';
import Restablecer from './routes/Recuperar/Restablecer.jsx';
import Inicio from './Main/Inicio.jsx';
import Perfil from './routes/Perfil/Perfil.jsx';
import ContenidoRestaurante from './routes/Pages/ContenidoRestaurante.jsx';
import SobreNosotros from './routes/SobreNosotros/SobreNosotros.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PrivateRoute, PublicRoute } from './context/ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={
            <PublicRoute><Login /></PublicRoute>
          } />
          <Route path="/registro" element={
            <PublicRoute><Registro /></PublicRoute>
          } />
          <Route path="/recuperar" element={
            <PublicRoute><Recuperar /></PublicRoute>
          } />
          <Route path="/restablecer" element={
            <PublicRoute><Restablecer /></PublicRoute>
          } />
          <Route path="/inicio" element={
            <PrivateRoute><Inicio /></PrivateRoute>
          } />
          <Route path="/contenido/:id" element={
            <PrivateRoute><ContenidoRestaurante /></PrivateRoute>
          } />
          <Route path="/perfil" element={
            <PrivateRoute><Perfil /></PrivateRoute>
          } />
          <Route path="/nosotros" element={
            <PrivateRoute><SobreNosotros /></PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;