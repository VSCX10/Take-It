import { useState } from 'react';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import StatusBadge from '../components/StatusBadge';
import AlertBanner from '../components/AlertBanner';

const ESTADOS = ['pendiente', 'confirmada', 'cancelada', 'completada'];

function ReservaDetalleModal({ reserva, modoEdicion, onGuardar, onClose }) {
  const [editando, setEditando] = useState(modoEdicion);
  const [form, setForm] = useState({
    fecha: reserva.fecha, hora: reserva.hora?.slice(0, 5) || '', personas: reserva.personas, estado: reserva.estado,
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const campo = (name) => (e) => setForm((p) => ({ ...p, [name]: e.target.value }));

  const guardar = async () => {
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

  const cliente = reserva.usuario ? `${reserva.usuario.nombre} ${reserva.usuario.apellido}` : 'Cliente';

  return (
    <Modal
      titulo={`Reserva RS-${String(reserva.id).padStart(4, '0')}`}
      onClose={onClose}
      ancho="520px"
      footer={
        editando ? (
          <>
            <button className="am-btn am-btn-secundario" onClick={onClose} disabled={guardando}>Cancelar</button>
            <button className="am-btn am-btn-primario" onClick={guardar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </>
        ) : (
          <button className="am-btn am-btn-secundario" onClick={onClose}>Cerrar</button>
        )
      }
    >
      <AlertBanner tipo="error">{error}</AlertBanner>

      <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.75)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span><i className="ti ti-user" /> {cliente}</span>
        {reserva.usuario?.email && <span><i className="ti ti-mail" /> {reserva.usuario.email}</span>}
      </div>

      {editando ? (
        <div className="am-form-grid">
          <FormField label="Fecha" name="fecha" type="date" value={form.fecha} onChange={campo('fecha')} />
          <FormField label="Hora" name="hora" type="time" value={form.hora} onChange={campo('hora')} />
          <FormField label="Personas" name="personas" type="number" value={form.personas} onChange={campo('personas')} />
          <FormField
            label="Estado" name="estado" type="select" value={form.estado} onChange={campo('estado')}
            options={ESTADOS.map((e) => ({ value: e, label: e.charAt(0).toUpperCase() + e.slice(1) }))}
          />
        </div>
      ) : (
        <div className="am-form-grid">
          <div className="am-campo"><label>Fecha</label><span>{reserva.fecha}</span></div>
          <div className="am-campo"><label>Hora</label><span>{reserva.hora?.slice(0, 5)}</span></div>
          <div className="am-campo"><label>Personas</label><span>{reserva.personas}</span></div>
          <div className="am-campo"><label>Estado</label><StatusBadge value={reserva.estado} /></div>
          <div className="am-campo"><label>Total</label><span>S/ {Number(reserva.total || 0).toFixed(2)}</span></div>
          <div className="am-campo"><label>Método de pago</label><span>{reserva.metodoPago === 'tarjeta' ? 'Tarjeta' : 'Local'}</span></div>
        </div>
      )}

      {!editando && (
        <button className="am-btn am-btn-secundario" onClick={() => setEditando(true)}>
          <i className="ti ti-pencil" /> Editar
        </button>
      )}
    </Modal>
  );
}

export default ReservaDetalleModal;
