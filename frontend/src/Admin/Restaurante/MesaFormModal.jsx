import { useState } from 'react';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import AlertBanner from '../components/AlertBanner';

function MesaFormModal({ mesa, onGuardar, onClose }) {
  const editando = Boolean(mesa);
  const [form, setForm] = useState({
    codigo: mesa?.codigo || '',
    capacidad: mesa?.capacidad || 2,
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const campo = (name) => (e) => setForm((p) => ({ ...p, [name]: e.target.value }));

  const guardar = async () => {
    if (!form.capacidad) { setError('La capacidad es obligatoria'); return; }
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
      titulo={editando ? 'Editar mesa' : 'Nueva mesa'}
      onClose={onClose}
      ancho="420px"
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
      <FormField label="Número / código" name="codigo" value={form.codigo} onChange={campo('codigo')} placeholder="M1" />
      <FormField label="Capacidad" name="capacidad" type="number" value={form.capacidad} onChange={campo('capacidad')} required />
    </Modal>
  );
}

export default MesaFormModal;
