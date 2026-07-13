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
        </>
      )}
    </div>
  );
}

export default Dashboard;
