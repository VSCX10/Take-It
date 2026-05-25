import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Perfil.css';

function Perfil() {
  const { usuarioActual, cerrarSesion } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (usuarioActual) {
      fetch(`http://localhost:3000/api/reservas/${usuarioActual.id}`)
        .then((r) => r.json())
        .then((datos) => { setReservas(datos); setCargando(false); })
        .catch(() => setCargando(false));
    }
  }, [usuarioActual]);

  return (
    <div className="perfil-pagina">

      {/* HEADER */}
      <header className="perfil-header">
        <button className="perfil-back" onClick={() => navigate('/inicio')}>
          ← Volver
        </button>
        <h1 className="perfil-titulo">Mi Perfil</h1>
      </header>

      {/* DATOS DEL USUARIO */}
      <div className="perfil-contenido">
        <div className="perfil-card-usuario">
          <div className="perfil-avatar">
            {usuarioActual?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div className="perfil-info">
            <h2>{usuarioActual?.nombre} {usuarioActual?.apellido}</h2>
            <p>{usuarioActual?.email}</p>
          </div>
          <button className="perfil-btn-cerrar" onClick={() => { cerrarSesion(); navigate('/login'); }}>
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* RESERVAS */}
        <div className="perfil-reservas">
          <h3>Mis Reservas</h3>

          {cargando ? (
            <p>Cargando reservas...</p>
          ) : reservas.length === 0 ? (
            <div className="perfil-sin-reservas">
              <p>Aún no tienes reservas</p>
              <button onClick={() => navigate('/inicio')}>Explorar restaurantes</button>
            </div>
          ) : (
            <div className="perfil-lista-reservas">
              {reservas.map((reserva) => (
                <div key={reserva.id} className="perfil-tarjeta-reserva">
                  <div className="perfil-reserva-info">
                    <h4>Reserva #{reserva.id}</h4>
                    <p>📅 {reserva.fecha}</p>
                    <p>🕐 {reserva.hora}</p>
                    <p>👥 {reserva.personas} persona{reserva.personas > 1 ? 's' : ''}</p>
                    {reserva.total > 0 && <p>💰 S/ {reserva.total}</p>}
                  </div>
                  <span className={`perfil-estado perfil-estado-${reserva.estado}`}>
                    {reserva.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Perfil;