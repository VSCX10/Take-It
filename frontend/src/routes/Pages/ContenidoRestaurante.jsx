import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import './ContenidoRestaurante.css';
import { useAuth } from '../../context/AuthContext';

const MAX_UNIDADES = 10;

function getPrecioFinal(plato) {
    if (plato.descuentoPct > 0) {
        return parseFloat((plato.precio * (1 - plato.descuentoPct / 100)).toFixed(2));
    }
    return plato.precio;
}

function ContenidoRestaurante() {
    const { id } = useParams();
    const [menu, setMenu] = useState([]);
    const [restaurante, setRestaurante] = useState(null);
    const [pedido, setPedido] = useState([]);
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [personas, setPersonas] = useState(1);
    const [cargandoPago, setCargandoPago] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const [slots, setSlots] = useState(null);
    const [modalPago, setModalPago] = useState(false);
    const [procesandoTarjeta, setProcesandoTarjeta] = useState(false);
    const [tarjeta, setTarjeta] = useState({ numero: '', nombre: '', vencimiento: '', cvv: '' });
    const navigate = useNavigate();
    const { usuarioActual } = useAuth();

    useEffect(() => {
        fetch('http://localhost:3000/api/restaurantes')
            .then(r => r.json())
            .then(data => {
                const lista = data.data || data;
                setRestaurante(lista.find(r => r.id === parseInt(id)));
            });
        fetch(`http://localhost:3000/api/restaurantes/${id}/menu`)
            .then(r => r.json())
            .then(datos => setMenu(datos.data))
            .catch(() => {});
    }, [id]);

    // Disponibilidad de mesas por bloque de hora (fecha + personas)
    const cargarDisponibilidad = useCallback(() => {
        fetch(`http://localhost:3000/api/restaurantes/${id}/disponibilidad?fecha=${fecha}&personas=${personas}`)
            .then(r => r.json())
            .then(datos => setSlots(datos.data || []))
            .catch(() => setSlots([]));
    }, [id, fecha, personas]);

    useEffect(() => {
        if (fecha) cargarDisponibilidad();
    }, [fecha, cargarDisponibilidad]);

    const getCantidadEnPedido = (platoId) => {
        const item = pedido.find(i => i.id === platoId);
        return item ? item.cantidad : 0;
    };

    const getMaxPermitido = (plato) => {
        if (plato.stock === 0) return 0;
        if (plato.stock === null || plato.stock === undefined) return MAX_UNIDADES;
        return Math.min(MAX_UNIDADES, plato.stock);
    };

    const agregarPlato = (plato) => {
        if (plato.stock === 0) return;
        const max = getMaxPermitido(plato);
        const actual = getCantidadEnPedido(plato.id);
        if (actual >= max) return;

        const precioFinal = getPrecioFinal(plato);
        setPedido(prev => {
            const existe = prev.find(i => i.id === plato.id);
            if (existe) {
                return prev.map(i => i.id === plato.id ? { ...i, cantidad: i.cantidad + 1 } : i);
            }
            return [...prev, { ...plato, cantidad: 1, precioFinal }];
        });
    };

    const quitarPlato = (plato) => {
        setPedido(prev => {
            const existe = prev.find(i => i.id === plato.id);
            if (!existe) return prev;
            if (existe.cantidad === 1) return prev.filter(i => i.id !== plato.id);
            return prev.map(i => i.id === plato.id ? { ...i, cantidad: i.cantidad - 1 } : i);
        });
    };

    const subtotal = pedido.reduce((acc, i) => acc + (i.precioFinal ?? i.precio) * i.cantidad, 0);
    const subtotalBruto = pedido.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    const descuentoTotal = subtotalBruto - subtotal;
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    const validarCampos = () => {
        if (!fecha || !hora) { alert('Por favor selecciona fecha y hora'); return false; }
        return true;
    };

    const confirmarReserva = async (metodoPago) => {
        const resp = await fetch('http://localhost:3000/api/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuarioId: usuarioActual.id,
                restauranteId: parseInt(id),
                fecha, hora,
                personas: parseInt(personas),
                total: parseFloat(total.toFixed(2)),
                metodoPago,
            })
        });
        return await resp.json();
    };

    const pagarEnLocal = async () => {
        if (!validarCampos()) return;
        setCargandoPago(true);
        try {
            const datos = await confirmarReserva('local');
            if (datos.ok) {
                setMensajeExito('Reserva confirmada. Pagaras en el local al llegar.');
                setTimeout(() => navigate('/perfil'), 2200);
            } else {
                alert(datos.mensaje || 'No se pudo crear la reserva');
                cargarDisponibilidad();
            }
        } catch { alert('Error al procesar la reserva'); }
        finally { setCargandoPago(false); }
    };

    const abrirPagarAhora = () => {
        if (!validarCampos()) return;
        setModalPago(true);
    };

    const procesarTarjeta = async () => {
        const { numero, nombre, vencimiento, cvv } = tarjeta;
        if (!numero || !nombre || !vencimiento || !cvv) {
            alert('Completa todos los campos de pago'); return;
        }
        setProcesandoTarjeta(true);
        await new Promise(r => setTimeout(r, 2000));
        try {
            const datos = await confirmarReserva('tarjeta');
            if (datos.ok) {
                setModalPago(false);
                setMensajeExito('Pago procesado exitosamente. Redirigiendo a tu perfil...');
                setTimeout(() => navigate('/perfil'), 2200);
            } else {
                setModalPago(false);
                alert(datos.mensaje || 'No se pudo crear la reserva');
                cargarDisponibilidad();
            }
        } catch { alert('Error al procesar el pago'); }
        finally { setProcesandoTarjeta(false); }
    };

    const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    const formatVenc = (v) => v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');

    if (!restaurante) return <p>Cargando...</p>;

    return (
        <div className="contenido-restaurante">

            {/* BANNER */}
            <div className="banner-restaurante">
                <img src={restaurante.img} alt={restaurante.nombre} className="imagen-banner" />
                <div className="overlay-banner">
                    <h1>{restaurante.nombre}</h1>
                    <div className="datos-restaurante">
                        <span>⭐ {restaurante.rating}</span>
                        <span>{restaurante.categoria}</span>
                        <span>📍 {restaurante.direccion}</span>
                    </div>
                </div>
            </div>

            <div className="contenedor-volver">
                <button className="btn-volver" onClick={() => navigate('/inicio')}>← Volver al inicio</button>
            </div>

            <div className="layout-restaurante">

                {/* MENÚ */}
                <div className="contenido-menu">
                    <div className="cabecera-menu">
                        <h2>Menú Disponible</h2>
                        <p>Selecciona tus platos para la preorden</p>
                    </div>

                    <div className="grid-platos">
                        {menu.length === 0 ? (
                            <p>No hay platos disponibles</p>
                        ) : (
                            menu.map(plato => {
                                const agotado = plato.stock === 0;
                                const tieneDescuento = plato.descuentoPct > 0;
                                const precioFinal = getPrecioFinal(plato);
                                const cantidad = getCantidadEnPedido(plato.id);
                                const max = getMaxPermitido(plato);
                                const limiteAlcanzado = cantidad >= max && !agotado;

                                return (
                                    <div key={plato.id} className={`tarjeta-plato${agotado ? ' plato-agotado' : ''}`}>
                                        <div className="contenedor-imagen-plato">
                                            <img src={plato.imagen} alt={plato.nombre} className="imagen-plato" />
                                            {agotado && (
                                                <div className="sold-overlay">
                                                    <i className="ti ti-ban" />
                                                    <span className="sold-texto">No disponible</span>
                                                </div>
                                            )}
                                            {tieneDescuento && !agotado && (
                                                <span className="dsct-badge">-{plato.descuentoPct}%</span>
                                            )}
                                        </div>

                                        <div className="info-plato">
                                            <div>
                                                <h3>{plato.nombre}</h3>
                                                <p className="descripcion-plato">{plato.descripcion}</p>
                                            </div>
                                            <div className="footer-plato">
                                                <div className="precio-wrap">
                                                    {tieneDescuento ? (
                                                        <>
                                                            <span className="precio-original">S/ {plato.precio.toFixed(2)}</span>
                                                            <span className="precio-dsct">S/ {precioFinal.toFixed(2)}</span>
                                                        </>
                                                    ) : (
                                                        <span className="precio">S/ {plato.precio.toFixed(2)}</span>
                                                    )}
                                                </div>

                                                {agotado ? (
                                                    <button className="btn-agregar btn-agotado" disabled>Agotado</button>
                                                ) : cantidad > 0 ? (
                                                    <div className="controles-cantidad">
                                                        <button className="btn-quitar" onClick={() => quitarPlato(plato)}>−</button>
                                                        <span>{cantidad}</span>
                                                        <button
                                                            className={`btn-quitar${limiteAlcanzado ? ' btn-limite' : ''}`}
                                                            onClick={() => agregarPlato(plato)}
                                                            disabled={limiteAlcanzado}
                                                            title={limiteAlcanzado ? `Límite de ${MAX_UNIDADES} unidades` : ''}
                                                        >+</button>
                                                    </div>
                                                ) : (
                                                    <button className={`btn-agregar${tieneDescuento ? ' btn-agregar-dsct' : ''}`} onClick={() => agregarPlato(plato)}>
                                                        Agregar
                                                    </button>
                                                )}

                                                {limiteAlcanzado && (
                                                    <span className="limite-msg">Límite de {MAX_UNIDADES} und.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* SIDEBAR RESERVA */}
                <div className="sidebar-reserva">
                    <div className="card-reserva">

                        <div className="cr-reserva-header">
                            <span className="cr-reserva-tag">Tu Reserva</span>
                            <h2 className="cr-reserva-rest">{restaurante.nombre}</h2>
                            <div className="cr-reserva-deco" />
                        </div>

                        <div className="cr-campos">
                            <div className="cr-campo">
                                <i className="ti ti-calendar cr-campo-icono" />
                                <div className="cr-campo-wrap">
                                    <label className="cr-campo-label">Fecha</label>
                                    <input
                                        type="date"
                                        className="cr-campo-input"
                                        value={fecha}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={e => { setFecha(e.target.value); setHora(''); setSlots(null); }}
                                    />
                                </div>
                            </div>
                            <div className="cr-campo">
                                <i className="ti ti-users cr-campo-icono" />
                                <div className="cr-campo-wrap">
                                    <label className="cr-campo-label">Personas</label>
                                    <select
                                        className="cr-campo-input"
                                        value={personas}
                                        onChange={e => { setPersonas(e.target.value); setHora(''); setSlots(null); }}
                                    >
                                        {[1,2,3,4,5,6,7,8].map(n => (
                                            <option key={n} value={n}>{n} persona{n > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* HORARIOS CON DISPONIBILIDAD DE MESAS */}
                        <div className="cr-horarios">
                            <label className="cr-campo-label"><i className="ti ti-clock" /> Hora</label>
                            {!fecha ? (
                                <p className="cr-horarios-aviso">Selecciona una fecha para ver los horarios</p>
                            ) : slots === null ? (
                                <p className="cr-horarios-aviso">Cargando horarios...</p>
                            ) : slots.length === 0 ? (
                                <p className="cr-horarios-aviso">No hay horarios disponibles</p>
                            ) : (
                                <>
                                    <div className="grid-horas">
                                        {slots.map(s => (
                                            <button
                                                key={s.hora}
                                                type="button"
                                                className={`slot-hora${hora === s.hora ? ' activo' : ''}${s.disponible && s.mesasLibres <= 2 ? ' pocas' : ''}`}
                                                disabled={!s.disponible}
                                                onClick={() => setHora(s.hora)}
                                                title={s.disponible ? `${s.mesasLibres} mesa(s) libre(s)` : 'Completo'}
                                            >
                                                {s.hora}
                                                {s.disponible && s.mesasLibres <= 2 && <span className="slot-punto" />}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="grid-horas-leyenda">
                                        <span><i className="pt libre" /> Disponible</span>
                                        <span><i className="pt pocas" /> Últimas mesas</span>
                                        <span><i className="pt lleno" /> Completo</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="cr-preorden">
                            <div className="cr-preorden-titulo">
                                <i className="ti ti-shopping-bag" />
                                <span>Preorden</span>
                                {pedido.length > 0 && (
                                    <span className="cr-preorden-count">{pedido.reduce((a, i) => a + i.cantidad, 0)}</span>
                                )}
                            </div>

                            {pedido.length === 0 ? (
                                <div className="cr-preorden-vacio">
                                    <i className="ti ti-bowl" />
                                    <p>Agrega platos del menú para incluir una preorden</p>
                                </div>
                            ) : (
                                <div className="cr-items-lista">
                                    {pedido.map(item => (
                                        <div key={item.id} className="cr-item">
                                            <div className="cr-item-info">
                                                <span className="cr-item-nombre">{item.nombre}</span>
                                                <div className="cr-item-precios">
                                                    {item.descuentoPct > 0 && (
                                                        <span className="cr-item-orig">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                                                    )}
                                                    <span className="cr-item-precio">
                                                        S/ {((item.precioFinal ?? item.precio) * item.cantidad).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="cr-item-controles">
                                                <button className="cr-ctrl" onClick={() => quitarPlato(item)}>−</button>
                                                <span className="cr-ctrl-cant">{item.cantidad}</span>
                                                <button
                                                    className="cr-ctrl"
                                                    onClick={() => agregarPlato(item)}
                                                    disabled={item.cantidad >= getMaxPermitido(item)}
                                                >+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {pedido.length > 0 && (
                            <div className="cr-totales">
                                <div className="cr-total-fila">
                                    <span>Subtotal</span>
                                    <span>S/ {subtotalBruto.toFixed(2)}</span>
                                </div>
                                {descuentoTotal > 0 && (
                                    <div className="cr-total-fila cr-total-descuento">
                                        <span><i className="ti ti-tag" /> Descuento aplicado</span>
                                        <span className="cr-dsct-valor">− S/ {descuentoTotal.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="cr-total-fila">
                                    <span>IGV 18%</span>
                                    <span>S/ {igv.toFixed(2)}</span>
                                </div>
                                <div className="cr-total-fila cr-total-final">
                                    <span>Total</span>
                                    <span>S/ {total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {mensajeExito && (
                            <div className="cr-exito">
                                <i className="ti ti-circle-check" />
                                {mensajeExito}
                            </div>
                        )}

                        <div className="cr-botones-pago">
                            <button className="cr-btn-local" onClick={pagarEnLocal} disabled={cargandoPago}>
                                <i className="ti ti-building-store" />
                                {cargandoPago ? 'Procesando...' : 'Pagar en local'}
                            </button>
                            <button className="cr-btn-ahora" onClick={abrirPagarAhora} disabled={cargandoPago}>
                                <i className="ti ti-credit-card" />
                                Pagar ahora
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* MODAL PAGO CON TARJETA */}
            {modalPago && (
                <div className="cr-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModalPago(false); }}>
                    <div className="cr-modal">
                        <div className="cr-modal-header">
                            <div>
                                <span className="cr-modal-tag">Pago seguro</span>
                                <h3 className="cr-modal-titulo">Total: S/ {total.toFixed(2)}</h3>
                            </div>
                            <button className="cr-modal-cerrar" onClick={() => setModalPago(false)}>
                                <i className="ti ti-x" />
                            </button>
                        </div>

                        <div className="cr-modal-body">
                            <div className="cr-modal-campo">
                                <label>Número de tarjeta</label>
                                <div className="cr-modal-input-wrap">
                                    <i className="ti ti-credit-card" />
                                    <input
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={tarjeta.numero}
                                        onChange={e => setTarjeta(p => ({ ...p, numero: formatCard(e.target.value) }))}
                                        maxLength={19}
                                    />
                                </div>
                            </div>
                            <div className="cr-modal-campo">
                                <label>Nombre en la tarjeta</label>
                                <div className="cr-modal-input-wrap">
                                    <i className="ti ti-user" />
                                    <input
                                        type="text"
                                        placeholder="RODRIGO ARRIETA"
                                        value={tarjeta.nombre}
                                        onChange={e => setTarjeta(p => ({ ...p, nombre: e.target.value.toUpperCase() }))}
                                    />
                                </div>
                            </div>
                            <div className="cr-modal-fila">
                                <div className="cr-modal-campo">
                                    <label>Vencimiento</label>
                                    <div className="cr-modal-input-wrap">
                                        <i className="ti ti-calendar" />
                                        <input
                                            type="text"
                                            placeholder="MM/AA"
                                            value={tarjeta.vencimiento}
                                            onChange={e => setTarjeta(p => ({ ...p, vencimiento: formatVenc(e.target.value) }))}
                                            maxLength={5}
                                        />
                                    </div>
                                </div>
                                <div className="cr-modal-campo">
                                    <label>CVV</label>
                                    <div className="cr-modal-input-wrap">
                                        <i className="ti ti-lock" />
                                        <input
                                            type="password"
                                            placeholder="***"
                                            value={tarjeta.cvv}
                                            onChange={e => setTarjeta(p => ({ ...p, cvv: e.target.value.replace(/\D/g,'').slice(0,4) }))}
                                            maxLength={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="cr-btn-pagar-tarjeta" onClick={procesarTarjeta} disabled={procesandoTarjeta}>
                            {procesandoTarjeta
                                ? <><i className="ti ti-loader-2 cr-spin" /> Procesando pago...</>
                                : <><i className="ti ti-lock" /> Confirmar pago · S/ {total.toFixed(2)}</>
                            }
                        </button>

                        <p className="cr-modal-aviso">
                            <i className="ti ti-shield-check" /> Transacción simulada — sin cargo real
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ContenidoRestaurante;
