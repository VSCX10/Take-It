import { useState } from 'react';
import FormField from '../components/FormField';
import AlertBanner from '../components/AlertBanner';

// Solo interfaz por ahora: no persiste en backend (a futuro)
function ConfiguracionGeneral() {
  const [form, setForm] = useState({
    nombrePlataforma: 'Take&It',
    logo: '',
    correoNotificaciones: '',
    minutosAnticipacionReserva: '30',
    maxPersonasPorReserva: '8',
  });
  const [guardado, setGuardado] = useState(false);

  const campo = (name) => (e) => { setGuardado(false); setForm((p) => ({ ...p, [name]: e.target.value })); };

  const guardar = (e) => {
    e.preventDefault();
    setGuardado(true);
  };

  return (
    <div>
      <div className="am-page-header">
        <div>
          <h1 className="am-page-title">Configuración General</h1>
          <p className="am-page-sub">Ajustes de la plataforma (próximamente conectado al backend)</p>
        </div>
      </div>

      {guardado && <AlertBanner tipo="exito">Cambios guardados localmente.</AlertBanner>}

      <form className="am-card" onSubmit={guardar} style={{ maxWidth: 640 }}>
        <div className="am-form-grid">
          <div className="am-campo-full">
            <FormField label="Nombre de la plataforma" name="nombrePlataforma" value={form.nombrePlataforma} onChange={campo('nombrePlataforma')} />
          </div>
          <div className="am-campo-full">
            <FormField label="URL del logo" name="logo" value={form.logo} onChange={campo('logo')} placeholder="https://..." />
          </div>

          <p className="am-campo-full" style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>Correos</p>
          <div className="am-campo-full">
            <FormField label="Correo de notificaciones" name="correoNotificaciones" type="email" value={form.correoNotificaciones} onChange={campo('correoNotificaciones')} placeholder="notificaciones@takeit.com" />
          </div>

          <p className="am-campo-full" style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>Reservas</p>
          <FormField label="Anticipación mínima (minutos)" name="minutosAnticipacionReserva" type="number" value={form.minutosAnticipacionReserva} onChange={campo('minutosAnticipacionReserva')} />
          <FormField label="Máximo de personas por reserva" name="maxPersonasPorReserva" type="number" value={form.maxPersonasPorReserva} onChange={campo('maxPersonasPorReserva')} />
        </div>

        <div style={{ marginTop: 20 }}>
          <button type="submit" className="am-btn am-btn-primario">
            <i className="ti ti-check" /> Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConfiguracionGeneral;
