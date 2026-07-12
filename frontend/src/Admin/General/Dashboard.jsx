import { useEffect, useState } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import StatCard from '../components/StatCard';
import AlertBanner from '../components/AlertBanner';

const TARJETAS = [
  { key: 'totalRestaurantes', label: 'Restaurantes registrados', icon: 'ti-building-store' },
  { key: 'totalAdministradores', label: 'Administradores de restaurante', icon: 'ti-users' },
  { key: 'totalReservas', label: 'Reservas realizadas', icon: 'ti-calendar' },
  { key: 'reservasDelDia', label: 'Reservas de hoy', icon: 'ti-calendar-check' },
  { key: 'restaurantesActivos', label: 'Restaurantes activos', icon: 'ti-circle-check' },
  { key: 'promocionesActivas', label: 'Promociones activas', icon: 'ti-discount' },
];

function Dashboard() {
  const api = useAdminApi();
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/general/dashboard').then(setResumen).catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="am-page-header">
        <div>
          <h1 className="am-page-title">Dashboard</h1>
          <p className="am-page-sub">Resumen general de la plataforma</p>
        </div>
      </div>

      <AlertBanner tipo="error">{error}</AlertBanner>

      {!resumen ? (
        <div className="am-tabla-estado">Cargando...</div>
      ) : (
        <>
          <div className="am-stats-grid">
            {TARJETAS.map((t) => (
              <StatCard key={t.key} icono={t.icon} etiqueta={t.label} valor={resumen[t.key]} />
            ))}
          </div>

          <div className="am-card">
            <h3 style={{ marginBottom: 14, fontFamily: "'Playfair Display', serif", fontSize: 17 }}>
              Reseñas recientes
            </h3>
            {resumen.resenasRecientes.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13.5 }}>Aún no hay reseñas registradas.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {resumen.resenasRecientes.map((r) => (
                  <div key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,.06)', paddingBottom: 10 }}>
                    <strong style={{ fontSize: 13.5 }}>{r.clienteNombre || 'Cliente'}</strong>
                    <span style={{ marginLeft: 8, color: 'var(--naranja)', fontSize: 13 }}>
                      {'★'.repeat(r.calificacion)}{'☆'.repeat(5 - r.calificacion)}
                    </span>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 4 }}>{r.comentario}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
