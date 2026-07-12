import { useEffect, useState } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertBanner from '../components/AlertBanner';
import PromocionFormModal from './PromocionFormModal';
import './PromocionesLista.css';

function PromocionesLista() {
  const api = useAdminApi();
  const [promos, setPromos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    api.get('/restaurante/promociones').then(setPromos).catch((e) => setError(e.message)).finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guardar = async (form) => {
    if (editando) {
      const actualizada = await api.put(`/restaurante/promociones/${editando.id}`, form);
      setPromos((prev) => prev.map((p) => (p.id === actualizada.id ? actualizada : p)));
    } else {
      const creada = await api.post('/restaurante/promociones', form);
      setPromos((prev) => [creada, ...prev]);
    }
    setModalAbierto(false);
    setEditando(null);
  };

  const toggleActiva = async (p) => {
    const actualizada = await api.patch(`/restaurante/promociones/${p.id}/estado`, { activa: !p.activa });
    setPromos((prev) => prev.map((x) => (x.id === actualizada.id ? actualizada : x)));
  };

  const eliminar = async () => {
    setEliminando(true);
    try {
      await api.del(`/restaurante/promociones/${porEliminar.id}`);
      setPromos((prev) => prev.filter((p) => p.id !== porEliminar.id));
      setPorEliminar(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div>
      <div className="am-page-header">
        <div>
          <h1 className="am-page-title">Promociones</h1>
          <p className="am-page-sub">{promos.length} promoción{promos.length !== 1 ? 'es' : ''}</p>
        </div>
        <button className="am-btn am-btn-primario" onClick={() => { setEditando(null); setModalAbierto(true); }}>
          <i className="ti ti-plus" /> Nueva promoción
        </button>
      </div>

      <AlertBanner tipo="error">{error}</AlertBanner>

      {cargando ? (
        <div className="am-tabla-estado">Cargando...</div>
      ) : promos.length === 0 ? (
        <div className="am-tabla-estado">Aún no has creado promociones</div>
      ) : (
        <div className="ap-grid">
          {promos.map((p) => (
            <div key={p.id} className="ap-card">
              <div className="ap-card-img">
                {p.imagen ? <img src={p.imagen} alt={p.titulo} /> : <i className="ti ti-photo" />}
                <div className="ap-card-estado"><StatusBadge value={p.activa ? 'activo' : 'inactivo'} /></div>
              </div>
              <div className="ap-card-body">
                <h3>{p.titulo}</h3>
                <p>{p.descripcion}</p>
                <span className="ap-card-fechas">
                  <i className="ti ti-calendar" /> {p.fechaInicio} — {p.fechaFin}
                </span>
                <div className="ap-card-acciones">
                  <button className="am-btn-icono" title="Editar" onClick={() => { setEditando(p); setModalAbierto(true); }}>
                    <i className="ti ti-pencil" />
                  </button>
                  <button className="am-btn-icono" title={p.activa ? 'Desactivar' : 'Activar'} onClick={() => toggleActiva(p)}>
                    <i className={`ti ${p.activa ? 'ti-ban' : 'ti-circle-check'}`} />
                  </button>
                  <button className="am-btn-icono am-btn-icono-peligro" title="Eliminar" onClick={() => setPorEliminar(p)}>
                    <i className="ti ti-trash" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAbierto && (
        <PromocionFormModal promocion={editando} onGuardar={guardar} onClose={() => { setModalAbierto(false); setEditando(null); }} />
      )}

      {porEliminar && (
        <ConfirmDialog
          titulo="Eliminar promoción"
          mensaje={`¿Eliminar la promoción "${porEliminar.titulo}"?`}
          cargando={eliminando}
          onConfirmar={eliminar}
          onCancelar={() => setPorEliminar(null)}
        />
      )}
    </div>
  );
}

export default PromocionesLista;
