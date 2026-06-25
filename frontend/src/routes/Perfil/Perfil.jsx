import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Perfil.css';

const PREFIJOS = [
  { pais: 'Perú',      codigo: '+51', bandera: '🇵🇪' },
  { pais: 'Argentina', codigo: '+54', bandera: '🇦🇷' },
  { pais: 'Bolivia',   codigo: '+591', bandera: '🇧🇴' },
  { pais: 'Chile',     codigo: '+56', bandera: '🇨🇱' },
  { pais: 'Colombia',  codigo: '+57', bandera: '🇨🇴' },
  { pais: 'Ecuador',   codigo: '+593', bandera: '🇪🇨' },
  { pais: 'México',    codigo: '+52', bandera: '🇲🇽' },
  { pais: 'Paraguay',  codigo: '+595', bandera: '🇵🇾' },
  { pais: 'Uruguay',   codigo: '+598', bandera: '🇺🇾' },
  { pais: 'Venezuela', codigo: '+58', bandera: '🇻🇪' },
  { pais: 'Brasil',    codigo: '+55', bandera: '🇧🇷' },
  { pais: 'España',    codigo: '+34', bandera: '🇪🇸' },
  { pais: 'EE.UU.',    codigo: '+1',  bandera: '🇺🇸' },
];

const PASOS_ESTADO = [
  { key: 'pendiente',  label: 'Registrado'        },
  { key: 'revisando', label: 'Pend. confirmar'   },
  { key: 'confirmada', label: 'Confirmado'        },
];

function pasoActivo(estado) {
  if (!estado) return 0;
  const s = estado.toLowerCase();
  if (s === 'confirmada') return 2;
  if (s === 'revisando')  return 1;
  return 0;
}

function Perfil() {
  const { usuarioActual, cerrarSesion, actualizarPerfil } = useAuth();
  const [reservas, setReservas]   = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [editando, setEditando]   = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [foto, setFoto]           = useState(() => localStorage.getItem(`foto_${usuarioActual?.id}`) || null);
  const [prefijo, setPrefijo]     = useState('+51');

  const [form, setForm] = useState({
    nombre:   usuarioActual?.nombre   || '',
    apellido: usuarioActual?.apellido || '',
    telefono: usuarioActual?.telefono || '',
  });

  const inputFotoRef = useRef(null);
  const navigate     = useNavigate();

  useEffect(() => {
    if (usuarioActual) {
      setForm({
        nombre:   usuarioActual.nombre   || '',
        apellido: usuarioActual.apellido || '',
        telefono: usuarioActual.telefono || '',
      });
      fetch(`http://localhost:3000/api/reservas/${usuarioActual.id}`)
        .then(r => r.json())
        .then(datos => { setReservas(datos.data || []); setCargando(false); })
        .catch(() => setCargando(false));
    }
  }, [usuarioActual]);

  const elegirFoto = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = (ev) => {
      const base64 = ev.target.result;
      setFoto(base64);
      localStorage.setItem(`foto_${usuarioActual.id}`, base64);
    };
    lector.readAsDataURL(archivo);
  };

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      const resp = await fetch(`http://localhost:3000/api/usuarios/${usuarioActual.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, telefono: `${prefijo} ${form.telefono}` }),
      });
      if (resp.ok) {
        actualizarPerfil({ ...form, telefono: `${prefijo} ${form.telefono}` });
        setEditando(false);
      }
    } catch (_) {
      // silencioso; datos quedan en pantalla
    } finally {
      setGuardando(false);
    }
  };

  const cerrar = () => { cerrarSesion(); navigate('/login'); };

  const inicial = (usuarioActual?.nombre?.[0] || '?').toUpperCase();

  return (
    <div className="pf-pagina">

      {/* HEADER */}
      <header className="pf-header">
        <button className="pf-volver" onClick={() => navigate('/inicio')}>
          <i className="ti ti-arrow-left" /> Volver
        </button>
        <span className="pf-header-titulo">Mi Perfil</span>
        <button className="pf-cerrar-sesion" onClick={cerrar}>
          <i className="ti ti-logout" /> Cerrar sesión
        </button>
      </header>

      <div className="pf-cuerpo">

        {/* ── COLUMNA IZQUIERDA — datos del usuario */}
        <aside className="pf-lateral">
          <div className="pf-card-usuario">

            {/* Avatar con opción de foto */}
            <div className="pf-avatar-wrap">
              {foto
                ? <img src={foto} alt="Foto de perfil" className="pf-avatar-img" />
                : <div className="pf-avatar-letra">{inicial}</div>
              }
              <button
                className="pf-avatar-edit"
                onClick={() => inputFotoRef.current?.click()}
                title="Cambiar foto"
              >
                <i className="ti ti-camera" />
              </button>
              <input
                ref={inputFotoRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={elegirFoto}
              />
            </div>

            {editando ? (
              <div className="pf-form">
                <div className="pf-field">
                  <label>Nombre</label>
                  <input
                    value={form.nombre}
                    onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                    placeholder="Nombre"
                  />
                </div>
                <div className="pf-field">
                  <label>Apellido</label>
                  <input
                    value={form.apellido}
                    onChange={e => setForm(p => ({ ...p, apellido: e.target.value }))}
                    placeholder="Apellido"
                  />
                </div>
                <div className="pf-field">
                  <label>Teléfono</label>
                  <div className="pf-tel-wrap">
                    <select
                      className="pf-prefijo"
                      value={prefijo}
                      onChange={e => setPrefijo(e.target.value)}
                    >
                      {PREFIJOS.map(p => (
                        <option key={p.codigo} value={p.codigo}>
                          {p.bandera} {p.codigo}
                        </option>
                      ))}
                    </select>
                    <input
                      className="pf-tel-num"
                      value={form.telefono}
                      onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
                      placeholder="987 654 321"
                    />
                  </div>
                </div>
                <div className="pf-form-acciones">
                  <button className="pf-btn-guardar" onClick={guardarCambios} disabled={guardando}>
                    {guardando ? 'Guardando...' : <><i className="ti ti-check" /> Guardar</>}
                  </button>
                  <button className="pf-btn-cancelar" onClick={() => setEditando(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="pf-info">
                <h2 className="pf-nombre">{usuarioActual?.nombre} {usuarioActual?.apellido}</h2>
                <div className="pf-dato">
                  <i className="ti ti-mail" />
                  <span>{usuarioActual?.email}</span>
                </div>
                {form.telefono && (
                  <div className="pf-dato">
                    <i className="ti ti-phone" />
                    <span>{form.telefono}</span>
                  </div>
                )}
                <button className="pf-btn-editar" onClick={() => setEditando(true)}>
                  <i className="ti ti-pencil" /> Editar datos
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ── COLUMNA DERECHA — reservas */}
        <section className="pf-reservas">
          <div className="pf-reservas-header">
            <h3 className="pf-reservas-titulo">Mis Reservas</h3>
            <span className="pf-reservas-total">{reservas.length} reserva{reservas.length !== 1 ? 's' : ''}</span>
          </div>

          {cargando ? (
            <div className="pf-estado-msg">Cargando reservas...</div>
          ) : reservas.length === 0 ? (
            <div className="pf-sin-reservas">
              <i className="ti ti-calendar-off" />
              <p>Aún no tienes reservas</p>
              <button onClick={() => navigate('/inicio')}>
                <i className="ti ti-search" /> Explorar restaurantes
              </button>
            </div>
          ) : (
            <div className="pf-lista">
              {reservas.map((reserva) => {
                const cancelada = reserva.estado?.toLowerCase() === 'cancelada';
                const paso = pasoActivo(reserva.estado);
                const nombreRest = reserva.restaurante?.nombre || `Reserva #${reserva.id}`;
                const tienePreorden = reserva.total > 0;

                return (
                  <div key={reserva.id} className={`pf-tarjeta${cancelada ? ' pf-tarjeta-cancelada' : ''}`}>

                    {/* Cabecera tarjeta */}
                    <div className="pf-tarjeta-top">
                      <div className="pf-tarjeta-resto">
                        <span className="pf-tarjeta-id">#{reserva.id}</span>
                        <h4 className="pf-tarjeta-nombre">{nombreRest}</h4>
                      </div>
                      {tienePreorden && (
                        <span className="pf-tarjeta-monto">S/ {Number(reserva.total).toFixed(2)}</span>
                      )}
                    </div>

                    {/* Chips de datos */}
                    <div className="pf-chips">
                      <span className="pf-chip">
                        <i className="ti ti-calendar" />{reserva.fecha}
                      </span>
                      <span className="pf-chip">
                        <i className="ti ti-clock" />{reserva.hora}
                      </span>
                      <span className="pf-chip">
                        <i className="ti ti-users" />{reserva.personas} persona{reserva.personas > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Línea de tiempo */}
                    {cancelada ? (
                      <div className="pf-cancelada-badge">
                        <i className="ti ti-x" /> Reserva cancelada
                      </div>
                    ) : (
                      <div className="pf-timeline">
                        {PASOS_ESTADO.map((p, idx) => (
                          <React.Fragment key={p.key}>
                            <div className={`pf-paso${idx <= paso ? ' pf-paso-activo' : ''}${idx < paso ? ' pf-paso-listo' : ''}`}>
                              <div className="pf-paso-circulo">
                                {idx < paso
                                  ? <i className="ti ti-check" />
                                  : <span>{idx + 1}</span>
                                }
                              </div>
                              <span className="pf-paso-label">{p.label}</span>
                            </div>
                            {idx < PASOS_ESTADO.length - 1 && (
                              <div className={`pf-linea${idx < paso ? ' pf-linea-activa' : ''}`} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default Perfil;
