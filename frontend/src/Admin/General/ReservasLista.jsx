import { useEffect, useState } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import AlertBanner from '../components/AlertBanner';

const ESTADOS = ['', 'pendiente', 'confirmada', 'cancelada', 'completada'];

// Todas las reservas de la plataforma. Las que tienen preorden llegan como
// 'pendiente' para que el admin las confirme; las simples ya vienen confirmadas.
function ReservasLista() {
  const api = useAdminApi();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ fecha: '', estado: '', cliente: '' });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filtros.fecha) params.set('fecha', filtros.fecha);
    if (filtros.estado) params.set('estado', filtros.estado);
    if (filtros.cliente) params.set('cliente', filtros.cliente);
    api.get(`/general/reservas?${params.toString()}`)
      .then(setReservas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  const filtro = (name) => (e) => setFiltros((p) => ({ ...p, [name]: e.target.value }));

  const cambiarEstado = async (reserva, accion) => {
    const actualizada = await api.patch(`/general/reservas/${reserva.id}/${accion}`);
    setReservas((prev) => prev.map((r) => (r.id === actualizada.id ? { ...r, ...actualizada } : r)));
  };

  const columnas = [
    { key: 'id', label: 'Reserva', render: (r) => `RS-${String(r.id).padStart(4, '0')}` },
    { key: 'restaurante', label: 'Restaurante', render: (r) => r.restaurante?.nombre || '—' },
    { key: 'cliente', label: 'Cliente', render: (r) => r.usuario ? `${r.usuario.nombre} ${r.usuario.apellido}` : '—' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'hora', label: 'Hora', render: (r) => r.hora?.slice(0, 5) },
    { key: 'total', label: 'Preorden', render: (r) => r.total > 0 ? `S/ ${Number(r.total).toFixed(2)}` : '—' },
    { key: 'estado', label: 'Estado', render: (r) => <StatusBadge value={r.estado} /> },
  ];

  return (
    <div>
      <div className="am-page-header">
        <div>
          <h1 className="am-page-title">Reservas</h1>
          <p className="am-page-sub">{reservas.length} reserva{reservas.length !== 1 ? 's' : ''} en total</p>
        </div>
      </div>

      <AlertBanner tipo="error">{error}</AlertBanner>

      <div className="am-toolbar">
        <FormFiltro label="Fecha" type="date" value={filtros.fecha} onChange={filtro('fecha')} />
        <FormFiltro
          label="Estado" type="select" value={filtros.estado} onChange={filtro('estado')}
          options={ESTADOS.map((e) => ({ value: e, label: e ? e.charAt(0).toUpperCase() + e.slice(1) : 'Todos' }))}
        />
        <div className="am-search-box">
          <i className="ti ti-search" />
          <input placeholder="Nombre del cliente..." value={filtros.cliente} onChange={filtro('cliente')} />
        </div>
      </div>

      <DataTable
        columns={columnas}
        data={reservas}
        loading={cargando}
        emptyText="No hay reservas con esos filtros"
        actions={(r) => (
          <>
            {r.estado === 'pendiente' && (
              <button className="am-btn-icono" title="Confirmar" onClick={() => cambiarEstado(r, 'confirmar')}>
                <i className="ti ti-check" />
              </button>
            )}
            {r.estado === 'confirmada' && (
              <button className="am-btn-icono" title="Marcar completada" onClick={() => cambiarEstado(r, 'completar')}>
                <i className="ti ti-circle-check" />
              </button>
            )}
            {r.estado !== 'cancelada' && r.estado !== 'completada' && (
              <button className="am-btn-icono am-btn-icono-peligro" title="Cancelar" onClick={() => cambiarEstado(r, 'cancelar')}>
                <i className="ti ti-x" />
              </button>
            )}
          </>
        )}
      />
    </div>
  );
}

function FormFiltro({ label, ...props }) {
  return (
    <div className="am-campo" style={{ minWidth: 160 }}>
      <label>{label}</label>
      {props.type === 'select' ? (
        <select className="am-input" value={props.value} onChange={props.onChange}>
          {props.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input className="am-input" type={props.type} value={props.value} onChange={props.onChange} />
      )}
    </div>
  );
}

export default ReservasLista;
