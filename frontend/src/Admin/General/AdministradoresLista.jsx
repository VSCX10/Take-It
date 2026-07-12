import { useEffect, useState } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import AlertBanner from '../components/AlertBanner';
import Modal from '../components/Modal';
import AdministradorFormModal from './AdministradorFormModal';

function AdministradoresLista() {
  const api = useAdminApi();
  const [admins, setAdmins] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(null);
  const [passwordGenerada, setPasswordGenerada] = useState(null);

  const cargar = (q) => {
    setCargando(true);
    Promise.all([
      api.get(`/general/administradores${q ? `?q=${encodeURIComponent(q)}` : ''}`),
      api.get('/general/restaurantes'),
    ])
      .then(([listaAdmins, listaRest]) => { setAdmins(listaAdmins); setRestaurantes(listaRest); })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    Promise.all([api.get('/general/administradores'), api.get('/general/restaurantes')])
      .then(([listaAdmins, listaRest]) => { setAdmins(listaAdmins); setRestaurantes(listaRest); })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buscar = (e) => { e.preventDefault(); cargar(busqueda); };

  const nombreRestaurante = (id) => restaurantes.find((r) => r.id === id)?.nombre || '—';

  const guardar = async (form) => {
    const actualizado = await api.put(`/general/administradores/${editando.id}`, form);
    let final = actualizado;
    if (String(form.restauranteId || '') !== String(editando.restauranteId || '')) {
      final = await api.patch(`/general/administradores/${editando.id}/restaurante`, {
        restauranteId: form.restauranteId || null,
      });
    }
    setAdmins((prev) => prev.map((a) => (a.id === final.id ? final : a)));
    setEditando(null);
  };

  const toggleEstado = async (a) => {
    const actualizado = await api.patch(`/general/administradores/${a.id}/estado`, { activo: !a.activo });
    setAdmins((prev) => prev.map((x) => (x.id === actualizado.id ? actualizado : x)));
  };

  const resetearPassword = async (a) => {
    const { password } = await api.patch(`/general/administradores/${a.id}/password`);
    setPasswordGenerada({ admin: a, password });
  };

  const columnas = [
    { key: 'nombre', label: 'Nombre', render: (a) => `${a.nombre} ${a.apellido}` },
    { key: 'email', label: 'Correo' },
    { key: 'restauranteId', label: 'Restaurante', render: (a) => nombreRestaurante(a.restauranteId) },
    { key: 'activo', label: 'Acceso', render: (a) => <StatusBadge value={a.activo ? 'activo' : 'inactivo'} /> },
  ];

  return (
    <div>
      <div className="am-page-header">
        <div>
          <h1 className="am-page-title">Administradores</h1>
          <p className="am-page-sub">{admins.length} administrador{admins.length !== 1 ? 'es' : ''} de restaurante</p>
        </div>
      </div>

      <AlertBanner tipo="error">{error}</AlertBanner>

      <form className="am-toolbar" onSubmit={buscar}>
        <div className="am-search-box">
          <i className="ti ti-search" />
          <input placeholder="Buscar por nombre o correo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <button type="submit" className="am-btn am-btn-secundario">Buscar</button>
      </form>

      <DataTable
        columns={columnas}
        data={admins}
        loading={cargando}
        emptyText="No hay administradores registrados"
        actions={(a) => (
          <>
            <button className="am-btn-icono" title="Editar" onClick={() => setEditando(a)}>
              <i className="ti ti-pencil" />
            </button>
            <button className="am-btn-icono" title="Restablecer contraseña" onClick={() => resetearPassword(a)}>
              <i className="ti ti-key" />
            </button>
            <button className="am-btn-icono" title={a.activo ? 'Desactivar acceso' : 'Activar acceso'} onClick={() => toggleEstado(a)}>
              <i className={`ti ${a.activo ? 'ti-ban' : 'ti-circle-check'}`} />
            </button>
          </>
        )}
      />

      {editando && (
        <AdministradorFormModal
          admin={editando}
          restaurantes={restaurantes}
          onGuardar={guardar}
          onClose={() => setEditando(null)}
        />
      )}

      {passwordGenerada && (
        <Modal titulo="Contraseña restablecida" onClose={() => setPasswordGenerada(null)} ancho="440px">
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.7)' }}>
            Nueva contraseña para <strong>{passwordGenerada.admin.email}</strong>. Cópiala y compártela con el
            administrador — no se volverá a mostrar.
          </p>
          <div className="am-input" style={{ fontFamily: 'monospace', fontSize: 15, textAlign: 'center', userSelect: 'all' }}>
            {passwordGenerada.password}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdministradoresLista;
