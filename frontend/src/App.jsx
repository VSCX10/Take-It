import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './routes/Login/Login.jsx';
import Registro from './routes/Register/Register.jsx';
import Recuperar from './routes/Recuperar/Recuperar.jsx';
import Inicio from './Main/Inicio.jsx';
import Perfil from './routes/Perfil/Perfil.jsx';
import Favoritos from './routes/Favoritos/Favoritos.jsx';
import ContenidoRestaurante from './routes/Pages/ContenidoRestaurante.jsx';
import SobreNosotros from './routes/SobreNosotros/SobreNosotros.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PrivateRoute, PublicRoute } from './context/ProtectedRoute.jsx';

import { AdminRoute } from './Admin/AdminRoute.jsx';
import AccesoDenegado from './Admin/AccesoDenegado.jsx';
import AdminLayout from './Admin/layout/AdminLayout.jsx';
import Dashboard from './Admin/General/Dashboard.jsx';
import RestaurantesLista from './Admin/General/RestaurantesLista.jsx';
import ReservasLista from './Admin/General/ReservasLista.jsx';

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
          <Route path="/inicio" element={
            <PrivateRoute><Inicio /></PrivateRoute>
          } />
          <Route path="/contenido/:id" element={
            <PrivateRoute><ContenidoRestaurante /></PrivateRoute>
          } />
          <Route path="/perfil" element={
            <PrivateRoute><Perfil /></PrivateRoute>
          } />
          <Route path="/favoritos" element={
            <PrivateRoute><Favoritos /></PrivateRoute>
          } />
          <Route path="/nosotros" element={
            <PrivateRoute><SobreNosotros /></PrivateRoute>
          } />

          <Route path="/acceso-denegado" element={
            <PrivateRoute><AccesoDenegado /></PrivateRoute>
          } />

          <Route path="/panel/general" element={
            <AdminRoute roles={['admin_general']}><AdminLayout /></AdminRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="restaurantes" element={<RestaurantesLista />} />
            <Route path="reservas" element={<ReservasLista />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
