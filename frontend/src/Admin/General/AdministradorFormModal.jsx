import { useState } from 'react';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import AlertBanner from '../components/AlertBanner';

function AdministradorFormModal({ admin, restaurantes, onGuardar, onClose }) {
  const [form, setForm] = useState({
    nombre: admin.nombre || '',
    apellido: admin.apellido || '',
    email: admin.email || '',
    telefono: admin.telefono || '',
    restauranteId: admin.restauranteId || '',
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const campo = (name) => (e) => setForm((p) => ({ ...p, [name]: e.target.value }));

  const guardar = async () => {
    if (!form.nombre || !form.apellido || !form.email) {
      setError('Nombre, apellido y correo son obligatorios');
      return;
    }
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
      titulo="Editar administrador"
      onClose={onClose}
      ancho="560px"
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
        <FormField label="Nombre" name="nombre" value={form.nombre} onChange={campo('nombre')} required />
        <FormField label="Apellido" name="apellido" value={form.apellido} onChange={campo('apellido')} required />
        <FormField label="Correo" name="email" type="email" value={form.email} onChange={campo('email')} required />
        <FormField label="Teléfono" name="telefono" value={form.telefono} onChange={campo('telefono')} />
        <div className="am-campo-full">
          <FormField
            label="Restaurante asociado" name="restauranteId" type="select"
            value={form.restauranteId} onChange={campo('restauranteId')}
            options={[{ value: '', label: 'Sin asociar' }, ...restaurantes.map((r) => ({ value: r.id, label: r.nombre }))]}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AdministradorFormModal;
