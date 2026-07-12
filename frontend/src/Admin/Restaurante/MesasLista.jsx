import { useEffect, useState } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertBanner from '../components/AlertBanner';
import MesaFormModal from './MesaFormModal';

const ESTADOS = ['disponible', 'ocupada', 'mantenimiento'];

function MesasLista() {
  const api = useAdminApi();
  const [mesas, setMesas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    api.get('/restaurante/mesas').then(setMesas).catch((e) => setError(e.message)).finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guardar = async (form) => {
    if (editando) {
      const actualizada = await api.put(`/restaurante/mesas/${editando.id}`, form);
      setMesas((prev) => prev.map((m) => (m.id === actualizada.id ? actualizada : m)));
    } else {
      const creada = await api.post('/restaurante/mesas', form);
      setMesas((prev) => [...prev, creada]);
    }
    setModalAbierto(false);
    setEditando(null);
  };

  const cambiarEstado = async (mesa, estado) => {
    const actualizada = await api.patch(`/restaurante/mesas/${mesa.id}/estado`, { estado });
    setMesas((prev) => prev.map((m) => (m.id === actualizada.id ? actualizada : m)));
  };

  const eliminar = async () => {
    setEliminando(true);
    try {
      await api.del(`/restaurante/mesas/${porEliminar.id}`);
      setMesas((prev) => prev.filter((m) => m.id !== porEliminar.id));
      setPorEliminar(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setEliminando(false);
    }
  };

  const columnas = [
    { key: 'codigo', label: 'Número' },
    { key: 'capacidad', label: 'Capacidad', render: (m) => `${m.capacidad} personas` },
    {
      key: 'estado', label: 'Estado',
      render: (m) => (
        <select className="am-input" value={m.estado} onChange={(e) => cambiarEstado(m, e.target.value)} style={{ padding: '5px 10px', fontSize: 12.5 }}>
          {ESTADOS.map((e) => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
        </select>
      ),
    },
  ];

  return (
    <div>
      <div className="am-page-header">
        <div>
          <h1 className="am-page-title">Mesas</h1>
          <p className="am-page-sub">{mesas.length} mesa{mesas.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="am-btn am-btn-primario" onClick={() => { setEditando(null); setModalAbierto(true); }}>
          <i className="ti ti-plus" /> Nueva mesa
        </button>
      </div>

      <AlertBanner tipo="error">{error}</AlertBanner>

      <DataTable
        columns={columnas}
        data={mesas}
        loading={cargando}
        emptyText="Aún no has creado mesas"
        actions={(m) => (
          <>
            <button className="am-btn-icono" title="Editar" onClick={() => { setEditando(m); setModalAbierto(true); }}>
              <i className="ti ti-pencil" />
            </button>
            <button className="am-btn-icono am-btn-icono-peligro" title="Eliminar" onClick={() => setPorEliminar(m)}>
              <i className="ti ti-trash" />
            </button>
          </>
        )}
      />

      {modalAbierto && (
        <MesaFormModal mesa={editando} onGuardar={guardar} onClose={() => { setModalAbierto(false); setEditando(null); }} />
      )}

      {porEliminar && (
        <ConfirmDialog
          titulo="Eliminar mesa"
          mensaje={`¿Eliminar la mesa "${porEliminar.codigo || porEliminar.id}"?`}
          cargando={eliminando}
          onConfirmar={eliminar}
          onCancelar={() => setPorEliminar(null)}
        />
      )}
    </div>
  );
}

export default MesasLista;
