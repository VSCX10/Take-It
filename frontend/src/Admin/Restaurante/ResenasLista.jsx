import { useEffect, useState } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertBanner from '../components/AlertBanner';

function Estrellas({ n }) {
  return <span style={{ color: 'var(--naranja)' }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
}

function ResenasLista() {
  const api = useAdminApi();
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargar = (q) => {
    setCargando(true);
    api.get(`/restaurante/resenas${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      .then(setResenas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    api.get('/restaurante/resenas')
      .then(setResenas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buscar = (e) => { e.preventDefault(); cargar(busqueda); };

  const cambiarEstado = async (r, accion) => {
    const actualizada = await api.patch(`/restaurante/resenas/${r.id}/${accion}`);
    setResenas((prev) => prev.map((x) => (x.id === actualizada.id ? actualizada : x)));
  };

  const eliminar = async () => {
    setEliminando(true);
    try {
      await api.del(`/restaurante/resenas/${porEliminar.id}`);
      setResenas((prev) => prev.filter((r) => r.id !== porEliminar.id));
      setPorEliminar(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setEliminando(false);
    }
  };

  const columnas = [
    { key: 'cliente', label: 'Cliente', render: (r) => r.usuario ? `${r.usuario.nombre} ${r.usuario.apellido}` : (r.clienteNombre || 'Cliente') },
    { key: 'comentario', label: 'Comentario', render: (r) => <span style={{ display: 'block', maxWidth: 320 }}>{r.comentario}</span> },
    { key: 'calificacion', label: 'Calificación', render: (r) => <Estrellas n={r.calificacion} /> },
    { key: 'fecha', label: 'Fecha' },
    { key: 'estado', label: 'Estado', render: (r) => <StatusBadge value={r.estado} /> },
  ];

  return (
    <div>
      <div className="am-page-header">
        <div>
          <h1 className="am-page-title">Reseñas</h1>
          <p className="am-page-sub">{resenas.length} reseña{resenas.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <AlertBanner tipo="error">{error}</AlertBanner>

      <form className="am-toolbar" onSubmit={buscar}>
        <div className="am-search-box">
          <i className="ti ti-search" />
          <input placeholder="Buscar en comentarios o cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <button type="submit" className="am-btn am-btn-secundario">Buscar</button>
      </form>

      <DataTable
        columns={columnas}
        data={resenas}
        loading={cargando}
        emptyText="Aún no hay reseñas para este restaurante"
        actions={(r) => (
          <>
            {r.estado !== 'aprobada' && (
              <button className="am-btn-icono" title="Aprobar" onClick={() => cambiarEstado(r, 'aprobar')}>
                <i className="ti ti-check" />
              </button>
            )}
            {r.estado !== 'oculta' && (
              <button className="am-btn-icono" title="Ocultar" onClick={() => cambiarEstado(r, 'ocultar')}>
                <i className="ti ti-eye-off" />
              </button>
            )}
            <button className="am-btn-icono am-btn-icono-peligro" title="Eliminar" onClick={() => setPorEliminar(r)}>
              <i className="ti ti-trash" />
            </button>
          </>
        )}
      />

      {porEliminar && (
        <ConfirmDialog
          titulo="Eliminar reseña"
          mensaje="¿Eliminar esta reseña? Esta acción no se puede deshacer."
          cargando={eliminando}
          onConfirmar={eliminar}
          onCancelar={() => setPorEliminar(null)}
        />
      )}
    </div>
  );
}

export default ResenasLista;
