import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authHeaders } from '../../utils/authHeaders';
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

const FILTROS = [
  { key: 'activas',     label: 'Activas'     },
  { key: 'canceladas',  label: 'Canceladas'  },
  { key: 'finalizadas', label: 'Finalizadas' },
];

const PASOS_ESTADO = [
  { key: 'registrada', label: 'Registrada'    },
  { key: 'revisando',  label: 'Por confirmar' },
  { key: 'confirmada', label: 'Confirmada'    },
];

function pasoActivo(estado) {
  if (!estado) return 1;
  const s = estado.toLowerCase();
  if (s === 'confirmada' || s === 'completada') return 2;
  return 1;
}

function Perfil() {
  const { usuarioActual, cerrarSesion, actualizarPerfil, actualizarFoto } = useAuth();
  const [reservas, setReservas]             = useState([]);
  const [cargando, setCargando]             = useState(true);
  const [editando, setEditando]             = useState(false);
  const [guardando, setGuardando]           = useState(false);
  const [cancelando, setCancelando]         = useState(null);
  const [filtroReservas, setFiltroReservas] = useState('activas');
  const [prefijo, setPrefijo]               = useState('+51');

  const [form, setForm] = useState({
    nombre:   usuarioActual?.nombre   || '',
    apellido: usuarioActual?.apellido || '',
    telefono: '',
  });

  const inputFotoRef = useRef(null);
  const navigate     = useRef(useNavigate()).current;

  useEffect(() => {
    if (usuarioActual) {
      const tel = (usuarioActual.telefono || '').trim();
      const partes = tel.split(' ');
      const prefijoGuardado = partes[0]?.startsWith('+') ? partes[0] : '+51';
      const numeroSolo = partes[0]?.startsWith('+') ? partes.slice(1).join(' ') : tel;
      setPrefijo(prefijoGuardado);
      setForm({
        nombre:   usuarioActual.nombre   || '',
        apellido: usuarioActual.apellido || '',
        telefono: numeroSolo,
      });
      fetch(`/api/reservas/${usuarioActual.id}`, { headers: authHeaders() })
        .then(r => r.json())
        .then(datos => { setReservas(datos.data || []); setCargando(false); })
        .catch(() => setCargando(false));
    }
  }, [usuarioActual]);

  const elegirFoto = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = (ev) => { actualizarFoto(ev.target.result); };
    lector.readAsDataURL(archivo);
  };

  const cancelarReserva = async (id) => {
    setCancelando(id);
    try {
      const resp = await fetch(`/api/reservas/${id}/cancelar`, { method: 'PATCH', headers: authHeaders() });
      if (resp.ok) {
        setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: 'Cancelada' } : r));
      }
    } catch {
      // si falla la conexion no hacemos nada, el estado queda igual
    } finally {
      setCancelando(null);
    }
  };

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      const resp = await fetch(`/api/usuarios/${usuarioActual.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ ...form, telefono: `${prefijo} ${form.telefono}` }),
      });
      if (resp.ok) {
        actualizarPerfil({ ...form, telefono: `${prefijo} ${form.telefono}` });
        setEditando(false);
      }
    } catch {
      // si falla la conexion mantenemos el modo edicion abierto
    } finally {
      setGuardando(false);
    }
  };

  const cerrar = () => { cerrarSesion(); navigate('/login'); };
  const inicial = (usuarioActual?.nombre?.[0] || '?').toUpperCase();

  // Filtrado de reservas
  const reservasFiltradas = reservas.filter(r => {
    const s = (r.estado || '').toLowerCase();
    if (filtroReservas === 'canceladas')  return s === 'cancelada';
    if (filtroReservas === 'finalizadas') return s === 'completada';
    return s !== 'cancelada' && s !== 'completada';
  });

  return (
    <div className="pf-pagina">

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

        {/* ── COLUMNA IZQUIERDA */}
        <aside className="pf-lateral">
          <div className="pf-card-usuario">

            <div className="pf-avatar-wrap">
              {usuarioActual?.foto
                ? <img src={usuarioActual.foto} alt="Foto de perfil" className="pf-avatar-img" />
                : <div className="pf-avatar-letra">{inicial}</div>
              }
              <button className="pf-avatar-edit" onClick={() => inputFotoRef.current?.click()} title="Cambiar foto">
                <i className="ti ti-camera" />
              </button>
              <input ref={inputFotoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={elegirFoto} />
            </div>

            {editando ? (
              <div className="pf-form">
                <div className="pf-field">
                  <label>Nombre</label>
                  <input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Nombre" />
                </div>
                <div className="pf-field">
                  <label>Apellido</label>
                  <input value={form.apellido} onChange={e => setForm(p => ({ ...p, apellido: e.target.value }))} placeholder="Apellido" />
                </div>
                <div className="pf-field">
                  <label>Teléfono</label>
                  <div className="pf-tel-wrap">
                    <select className="pf-prefijo" value={prefijo} onChange={e => setPrefijo(e.target.value)}>
                      {PREFIJOS.map(p => (
                        <option key={p.codigo} value={p.codigo}>{p.bandera} {p.codigo}</option>
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
                  <button className="pf-btn-cancelar" onClick={() => setEditando(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="pf-info">
                <h2 className="pf-nombre">{usuarioActual?.nombre} {usuarioActual?.apellido}</h2>
                <div className="pf-dato">
                  <i className="ti ti-mail" />
                  <span>{usuarioActual?.email}</span>
                </div>
                {usuarioActual?.telefono && (
                  <div className="pf-dato">
                    <i className="ti ti-phone" />
                    <span>{usuarioActual.telefono}</span>
                  </div>
                )}
                <button className="pf-btn-editar" onClick={() => setEditando(true)}>
                  <i className="ti ti-pencil" /> Editar datos
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ── COLUMNA DERECHA */}
        <section className="pf-reservas">

          <div className="pf-reservas-header">
            <div className="pf-reservas-header-left">
              <h3 className="pf-reservas-titulo">Mis Reservas</h3>
              <span className="pf-reservas-total">
                {reservasFiltradas.length} reserva{reservasFiltradas.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="pf-filtros">
              {FILTROS.map(f => (
                <button
                  key={f.key}
                  className={`pf-filtro-btn${filtroReservas === f.key ? ' pf-filtro-activo' : ''}`}
                  onClick={() => setFiltroReservas(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
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
          ) : reservasFiltradas.length === 0 ? (
            <div className="pf-sin-reservas">
              <i className="ti ti-inbox" />
              <p>
                {filtroReservas === 'canceladas'  ? 'No tienes reservas canceladas'  :
                 filtroReservas === 'finalizadas' ? 'No tienes reservas finalizadas' :
                 'No tienes reservas activas'}
              </p>
            </div>
          ) : (
            <div className="pf-lista">
              {reservasFiltradas.map((reserva) => {
                const cancelada  = reserva.estado?.toLowerCase() === 'cancelada';
                const completada = reserva.estado?.toLowerCase() === 'completada';
                const paso = pasoActivo(reserva.estado);
                const nombreRest = reserva.restaurante?.nombre || `Reserva RS-${String(reserva.id).padStart(4, '0')}`;
                const tienePreorden = reserva.total > 0;

                return (
                  <div key={reserva.id} className={`pf-tarjeta${cancelada ? ' pf-tarjeta-cancelada' : ''}`}>

                    <div className="pf-tarjeta-top">
                      <div className="pf-tarjeta-resto">
                        <span className="pf-tarjeta-id">RS-{String(reserva.id).padStart(4, '0')}</span>
                        <h4 className="pf-tarjeta-nombre">{nombreRest}</h4>
                      </div>
                      {tienePreorden && (
                        <div style={{ textAlign: 'right' }}>
                          <span className="pf-tarjeta-monto">S/ {Number(reserva.total).toFixed(2)}</span>
                          <span className="pf-dsct-label"><i className="ti ti-tag" /> con descuento</span>
                        </div>
                      )}
                    </div>

                    <div className="pf-chips">
                      <span className="pf-chip"><i className="ti ti-calendar" />{reserva.fecha}</span>
                      <span className="pf-chip"><i className="ti ti-clock" />{reserva.hora}</span>
                      <span className="pf-chip"><i className="ti ti-users" />{reserva.personas} persona{reserva.personas > 1 ? 's' : ''}</span>
                      {reserva.metodoPago && (
                        <span className="pf-chip pf-chip-pago">
                          <i className={`ti ${reserva.metodoPago === 'tarjeta' ? 'ti-credit-card' : 'ti-building-store'}`} />
                          {reserva.metodoPago === 'tarjeta' ? 'Pagado con tarjeta' : 'Paga en local'}
                        </span>
                      )}
                    </div>

                    {cancelada ? (
                      <div className="pf-cancelada-badge">
                        <i className="ti ti-x" /> Reserva cancelada
                      </div>
                    ) : (
                      <>
                        <div className="pf-timeline">
                          {PASOS_ESTADO.map((p, idx) => (
                            <React.Fragment key={p.key}>
                              <div className={`pf-paso${idx <= paso ? ' pf-paso-activo' : ''}${idx < paso ? ' pf-paso-listo' : ''}`}>
                                <div className="pf-paso-circulo">
                                  {idx < paso ? <i className="ti ti-check" /> : <span>{idx + 1}</span>}
                                </div>
                                <span className="pf-paso-label">{p.label}</span>
                              </div>
                              {idx < PASOS_ESTADO.length - 1 && (
                                <div className={`pf-linea${idx < paso ? ' pf-linea-activa' : ''}`} />
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        {!completada && (
                          <div className="pf-tarjeta-footer">
                            <button
                              className="pf-btn-cancelar-reserva"
                              onClick={() => cancelarReserva(reserva.id)}
                              disabled={cancelando === reserva.id}
                            >
                              <i className="ti ti-calendar-x" />
                              {cancelando === reserva.id ? 'Cancelando...' : 'Cancelar reserva'}
                            </button>
                          </div>
                        )}
                      </>
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
