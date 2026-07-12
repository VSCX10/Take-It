import { useEffect, useState } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertBanner from '../components/AlertBanner';
import ReservaDetalleModal from './ReservaDetalleModal';

const ESTADOS = ['', 'pendiente', 'confirmada', 'cancelada', 'completada'];

function ReservasLista() {
  const api = useAdminApi();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ fecha: '', estado: '', cliente: '' });
  const [seleccion, setSeleccion] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filtros.fecha) params.set('fecha', filtros.fecha);
    if (filtros.estado) params.set('estado', filtros.estado);
    if (filtros.cliente) params.set('cliente', filtros.cliente);
    api.get(`/restaurante/reservas?${params.toString()}`)
      .then(setReservas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  const filtro = (name) => (e) => setFiltros((p) => ({ ...p, [name]: e.target.value }));

  const cambiarEstado = async (reserva, accion) => {
    const actualizada = await api.patch(`/restaurante/reservas/${reserva.id}/${accion}`);
    setReservas((prev) => prev.map((r) => (r.id === actualizada.id ? actualizada : r)));
  };

  const guardarEdicion = async (form) => {
    const actualizada = await api.put(`/restaurante/reservas/${seleccion.id}`, form);
    setReservas((prev) => prev.map((r) => (r.id === actualizada.id ? actualizada : r)));
    setSeleccion(null);
  };

  const eliminar = async () => {
    setEliminando(true);
    try {
      await api.del(`/restaurante/reservas/${porEliminar.id}`);
      setReservas((prev) => prev.filter((r) => r.id !== porEliminar.id));
      setPorEliminar(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setEliminando(false);
    }
  };

  const columnas = [
    { key: 'id', label: 'Reserva', render: (r) => `RS-${String(r.id).padStart(4, '0')}` },
    { key: 'cliente', label: 'Cliente', render: (r) => r.usuario ? `${r.usuario.nombre} ${r.usuario.apellido}` : '—' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'hora', label: 'Hora', render: (r) => r.hora?.slice(0, 5) },
    { key: 'personas', label: 'Personas' },
    { key: 'estado', label: 'Estado', render: (r) => <StatusBadge value={r.estado} /> },
  ];

  return (
    <div>
      <div className="am-page-header">
        <div>
          <h1 className="am-page-title">Reservas</h1>
          <p className="am-page-sub">{reservas.length} reserva{reservas.length !== 1 ? 's' : ''}</p>
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
            <button className="am-btn-icono" title="Ver" onClick={() => { setSeleccion(r); setModoEdicion(false); }}>
              <i className="ti ti-eye" />
            </button>
            <button className="am-btn-icono" title="Editar" onClick={() => { setSeleccion(r); setModoEdicion(true); }}>
              <i className="ti ti-pencil" />
            </button>
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
              <button className="am-btn-icono" title="Cancelar" onClick={() => cambiarEstado(r, 'cancelar')}>
                <i className="ti ti-x" />
              </button>
            )}
            <button className="am-btn-icono am-btn-icono-peligro" title="Eliminar" onClick={() => setPorEliminar(r)}>
              <i className="ti ti-trash" />
            </button>
          </>
        )}
      />

      {seleccion && (
        <ReservaDetalleModal
          reserva={seleccion}
          modoEdicion={modoEdicion}
          onGuardar={guardarEdicion}
          onClose={() => setSeleccion(null)}
        />
      )}

      {porEliminar && (
        <ConfirmDialog
          titulo="Eliminar reserva"
          mensaje={`¿Eliminar la reserva RS-${String(porEliminar.id).padStart(4, '0')}? Esta acción no se puede deshacer.`}
          cargando={eliminando}
          onConfirmar={eliminar}
          onCancelar={() => setPorEliminar(null)}
        />
      )}
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
