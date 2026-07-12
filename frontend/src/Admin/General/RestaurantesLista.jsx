import { useEffect, useState } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertBanner from '../components/AlertBanner';
import RestauranteFormModal from './RestauranteFormModal';

function RestaurantesLista() {
  const api = useAdminApi();
  const [restaurantes, setRestaurantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargar = (q) => {
    setCargando(true);
    api.get(`/general/restaurantes${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      .then(setRestaurantes)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    api.get('/general/restaurantes')
      .then(setRestaurantes)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buscar = (e) => {
    e.preventDefault();
    cargar(busqueda);
  };

  const guardar = async (form) => {
    if (editando) {
      const actualizado = await api.put(`/general/restaurantes/${editando.id}`, {
        nombre: form.nombre, categoria: form.categoria, direccion: form.direccion,
        telefono: form.telefono, img: form.img, descripcion: form.descripcion,
      });
      setRestaurantes((prev) => prev.map((r) => (r.id === actualizado.id ? actualizado : r)));
    } else {
      await api.post('/general/restaurantes', form);
      cargar(busqueda);
    }
    setModalAbierto(false);
    setEditando(null);
  };

  const toggleEstado = async (r) => {
    const actualizado = await api.patch(`/general/restaurantes/${r.id}/estado`, { activo: !r.activo });
    setRestaurantes((prev) => prev.map((x) => (x.id === actualizado.id ? actualizado : x)));
  };

  const eliminar = async () => {
    setEliminando(true);
    try {
      await api.del(`/general/restaurantes/${porEliminar.id}`);
      setRestaurantes((prev) => prev.filter((r) => r.id !== porEliminar.id));
      setPorEliminar(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setEliminando(false);
    }
  };

  const columnas = [
    { key: 'nombre', label: 'Restaurante' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'activo', label: 'Estado', render: (r) => <StatusBadge value={r.activo ? 'activo' : 'inactivo'} /> },
  ];

  return (
    <div>
      <div className="am-page-header">
        <div>
          <h1 className="am-page-title">Restaurantes</h1>
          <p className="am-page-sub">{restaurantes.length} restaurante{restaurantes.length !== 1 ? 's' : ''} registrado{restaurantes.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="am-btn am-btn-primario" onClick={() => { setEditando(null); setModalAbierto(true); }}>
          <i className="ti ti-plus" /> Nuevo restaurante
        </button>
      </div>

      <AlertBanner tipo="error">{error}</AlertBanner>

      <form className="am-toolbar" onSubmit={buscar}>
        <div className="am-search-box">
          <i className="ti ti-search" />
          <input placeholder="Buscar restaurante..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <button type="submit" className="am-btn am-btn-secundario">Buscar</button>
      </form>

      <DataTable
        columns={columnas}
        data={restaurantes}
        loading={cargando}
        emptyText="No se encontraron restaurantes"
        actions={(r) => (
          <>
            <button className="am-btn-icono" title="Editar" onClick={() => { setEditando(r); setModalAbierto(true); }}>
              <i className="ti ti-pencil" />
            </button>
            <button className="am-btn-icono" title={r.activo ? 'Desactivar' : 'Activar'} onClick={() => toggleEstado(r)}>
              <i className={`ti ${r.activo ? 'ti-ban' : 'ti-circle-check'}`} />
            </button>
            <button className="am-btn-icono am-btn-icono-peligro" title="Eliminar" onClick={() => setPorEliminar(r)}>
              <i className="ti ti-trash" />
            </button>
          </>
        )}
      />

      {modalAbierto && (
        <RestauranteFormModal
          restaurante={editando}
          onGuardar={guardar}
          onClose={() => { setModalAbierto(false); setEditando(null); }}
        />
      )}

      {porEliminar && (
        <ConfirmDialog
          titulo="Eliminar restaurante"
          mensaje={`¿Seguro que quieres eliminar "${porEliminar.nombre}"? Esta acción no se puede deshacer.`}
          cargando={eliminando}
          onConfirmar={eliminar}
          onCancelar={() => setPorEliminar(null)}
        />
      )}
    </div>
  );
}

export default RestaurantesLista;
