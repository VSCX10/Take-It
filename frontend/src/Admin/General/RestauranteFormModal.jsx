import { useState } from 'react';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import AlertBanner from '../components/AlertBanner';

const CATEGORIAS = ['Nikkei', 'Peruana', 'Criolla', 'Marina', 'Internacional', 'Fusión', 'Otro'];

function RestauranteFormModal({ restaurante, onGuardar, onClose }) {
  const editando = Boolean(restaurante);
  const [form, setForm] = useState({
    nombre: restaurante?.nombre || '',
    categoria: restaurante?.categoria || CATEGORIAS[0],
    direccion: restaurante?.direccion || '',
    telefono: restaurante?.telefono || '',
    img: restaurante?.img || '',
    descripcion: restaurante?.descripcion || '',
    nombreAdmin: '',
    correoAdmin: '',
    passwordAdmin: '',
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const campo = (name) => (e) => setForm((p) => ({ ...p, [name]: e.target.value }));

  const validar = () => {
    if (!form.nombre || !form.categoria) return 'Nombre y categoría son obligatorios';
    if (!editando && (!form.correoAdmin || !form.passwordAdmin)) {
      return 'El correo y la contraseña del administrador son obligatorios';
    }
    return '';
  };

  const guardar = async () => {
    const msg = validar();
    if (msg) { setError(msg); return; }
    setGuardando(true);
    setError('');
    try {
      await onGuardar(form);
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal
      titulo={editando ? 'Editar restaurante' : 'Nuevo restaurante'}
      onClose={onClose}
      ancho="640px"
      footer={
        <>
          <button className="am-btn am-btn-secundario" onClick={onClose} disabled={guardando}>Cancelar</button>
          <button className="am-btn am-btn-primario" onClick={guardar} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </>
      }
    >
      <AlertBanner tipo="error">{error}</AlertBanner>

      <div className="am-form-grid">
        <FormField label="Nombre del restaurante" name="nombre" value={form.nombre} onChange={campo('nombre')} required />
        <FormField
          label="Categoría" name="categoria" type="select" value={form.categoria} onChange={campo('categoria')}
          options={CATEGORIAS.map((c) => ({ value: c, label: c }))}
        />
        <FormField label="Dirección" name="direccion" value={form.direccion} onChange={campo('direccion')} />
        <FormField label="Teléfono" name="telefono" value={form.telefono} onChange={campo('telefono')} />
        <div className="am-campo-full">
          <FormField label="URL de imagen" name="img" value={form.img} onChange={campo('img')} placeholder="https://..." />
        </div>
        <div className="am-campo-full">
          <FormField label="Descripción" name="descripcion" type="textarea" value={form.descripcion} onChange={campo('descripcion')} />
        </div>
      </div>

      {!editando && (
        <>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Administrador del restaurante</p>
            <div className="am-form-grid">
              <FormField label="Nombre del administrador" name="nombreAdmin" value={form.nombreAdmin} onChange={campo('nombreAdmin')} placeholder={form.nombre} />
              <FormField label="Correo" name="correoAdmin" type="email" value={form.correoAdmin} onChange={campo('correoAdmin')} required />
              <FormField label="Contraseña" name="passwordAdmin" type="password" value={form.passwordAdmin} onChange={campo('passwordAdmin')} required />
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

export default RestauranteFormModal;
