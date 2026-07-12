import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authHeaders } from '../../utils/authHeaders';
import './Admin.css';

function Admin() {
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();
  const [pendientes, setPendientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(null);

  useEffect(() => {
    fetch('/api/admin/reservas', { headers: authHeaders() })
      .then(r => r.json())
      .then(datos => { setPendientes(datos.data || []); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  // Solo el admin puede ver esta pagina
  if (usuarioActual?.rol !== 'admin') return <Navigate to="/inicio" replace />;

  const decidir = async (id, accion) => {
    setProcesando(id);
    try {
      const resp = await fetch(`/api/admin/reservas/${id}/${accion}`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      if (resp.ok) {
        setPendientes(prev => prev.filter(r => r.id !== id));
      }
    } catch {
      // si falla se queda en la lista para reintentar
    } finally {
      setProcesando(null);
    }
  };

  return (
    <div className="ad-pagina">
      <header className="ad-header">
        <button className="ad-volver" onClick={() => navigate('/inicio')}>
          <i className="ti ti-arrow-left" /> Volver
        </button>
        <span className="ad-titulo">Panel de administración</span>
        <span className="ad-contador">
          {pendientes.length} pendiente{pendientes.length !== 1 ? 's' : ''}
        </span>
      </header>

      <main className="ad-cuerpo">
        <h2 className="ad-seccion">Reservas con preorden por confirmar</h2>
        <p className="ad-sub">Las reservas sin platos se confirman solas; estas esperan tu decisión.</p>

        {cargando ? (
          <div className="cargando-pantalla"><div className="spinner" /></div>
        ) : pendientes.length === 0 ? (
          <div className="ad-vacio">
            <i className="ti ti-clipboard-check" />
            <p>Todo al día: no hay reservas por confirmar</p>
          </div>
        ) : (
          <div className="ad-lista">
            {pendientes.map(r => (
              <div key={r.id} className="ad-tarjeta">
                <div className="ad-tarjeta-info">
                  <span className="ad-ticket">RS-{String(r.id).padStart(4, '0')}</span>
                  <h3 className="ad-restaurante">{r.restaurante?.nombre}</h3>
                  <p className="ad-cliente">
                    <i className="ti ti-user" /> {r.usuario?.nombre} {r.usuario?.apellido} · {r.usuario?.email}
                  </p>
                  <div className="ad-chips">
                    <span className="ad-chip"><i className="ti ti-calendar" />{r.fecha}</span>
                    <span className="ad-chip"><i className="ti ti-clock" />{String(r.hora).slice(0, 5)}</span>
                    <span className="ad-chip"><i className="ti ti-users" />{r.personas}</span>
                    <span className="ad-chip ad-chip-monto"><i className="ti ti-tag" />S/ {Number(r.total).toFixed(2)}</span>
                  </div>
                </div>
                <div className="ad-acciones">
                  <button
                    className="ad-btn-confirmar"
                    onClick={() => decidir(r.id, 'confirmar')}
                    disabled={procesando === r.id}
                  >
                    <i className="ti ti-check" /> Confirmar
                  </button>
                  <button
                    className="ad-btn-rechazar"
                    onClick={() => decidir(r.id, 'rechazar')}
                    disabled={procesando === r.id}
                  >
                    <i className="ti ti-x" /> Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
