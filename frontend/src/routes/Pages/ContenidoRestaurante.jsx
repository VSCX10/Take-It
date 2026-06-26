import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState, useCallback} from "react";
import "./ContenidoRestaurante.css";
import { useAuth } from "../../context/AuthContext";

function ContenidoRestaurante() {
    const {id} = useParams();
    const [menu, setMenu] = useState([]);
    const [restaurante, setRestaurante] = useState(null);
    const [pedido, setPedido] = useState([]);
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [personas, setPersonas] = useState(1);
    const [cargandoPago, setCargandoPago] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const [slots, setSlots] = useState(null);
    const navigate = useNavigate();
    const { usuarioActual } = useAuth();

    const agregarPlato = (plato) => {
        const platoExistente = pedido.find((item) => item.id === plato.id);
        if (platoExistente) {
            setPedido(pedido.map((item) => item.id === plato.id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
            ));
        } else {
            setPedido([...pedido, { ...plato, cantidad: 1 }]);
        }
    }

    const quitarPlato = (plato) => {
        const platoExistente = pedido.find((item) => item.id === plato.id);
        if (platoExistente.cantidad === 1) {
            setPedido(pedido.filter((item) => item.id !== plato.id));
        } else {
            setPedido(pedido.map((item) => item.id === plato.id
                ? { ...item, cantidad: item.cantidad - 1 }
                : item
            ));
        }
    }

    useEffect(() => {
        fetch('http://localhost:3000/api/restaurantes')
            .then((res) => res.json())
            .then((data) => {
                const lista = data.data || data;
                const restEncontrado = lista.find((r) => r.id === parseInt(id));
                setRestaurante(restEncontrado);
});
        fetch(`http://localhost:3000/api/restaurantes/${id}/menu`)
            .then((res) => res.json())
            .then((datos) => setMenu(datos.data))
            .catch(() => {});
    }, [id]);

    const cargarDisponibilidad = useCallback(() => {
        fetch(`http://localhost:3000/api/restaurantes/${id}/disponibilidad?fecha=${fecha}&personas=${personas}`)
            .then((res) => res.json())
            .then((datos) => setSlots(datos.data || []))
            .catch(() => setSlots([]));
    }, [id, fecha, personas]);

    useEffect(() => {
        if (fecha) cargarDisponibilidad();
    }, [fecha, cargarDisponibilidad]);

    const subtotal = pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    const procederPago = async () => {
        setMensajeError('');
        if (!fecha || !hora) {
            setMensajeError('Selecciona una fecha y una hora para continuar.');
            return;
        }

        setCargandoPago(true);
        try {
            const respuesta = await fetch('http://localhost:3000/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuarioId: usuarioActual.id,
                    restauranteId: parseInt(id),
                    fecha,
                    hora,
                    personas: parseInt(personas),
                    total: parseFloat(total.toFixed(2))
                })
            });

            const datos = await respuesta.json();

            if (datos.ok) {
                setMensajeExito('✅ ¡Reserva confirmada! Redirigiendo a tu perfil...');
                setTimeout(() => navigate('/perfil'), 2000);
            } else {
                setMensajeError(datos.mensaje || 'No se pudo completar la reserva.');
                cargarDisponibilidad();
            }
        } catch {
            setMensajeError('Error de conexión al procesar la reserva.');
        } finally {
            setCargandoPago(false);
        }
    };

    if (!restaurante) return (
        <div className="cargando-pantalla">
            <div className="spinner" />
            <p>Cargando restaurante...</p>
        </div>
    );

    return (
        <div className="contenido-restaurante">

            <header className="cr-nav">
                <h1 className="cr-logo" onClick={() => navigate('/inicio')}>Take<span>&</span>It</h1>
                <button className="btn-volver" onClick={() => navigate('/inicio')}>← Volver al inicio</button>
            </header>

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

            <div className="layout-restaurante">

                <div className="contenido-menu">
                    <div className="cabecera-menu">
                        <h2>Menú Disponible</h2>
                        <p>Selecciona tus platos para la preorden</p>
                    </div>

                    <div className="grid-platos">
                        {menu.length === 0 ? (
                            <p>No hay platos disponibles</p>
                        ) : (
                            menu.map((plato) => (
                                <div key={plato.id} className="tarjeta-plato">
                                    <div className="contenedor-imagen-plato">
                                        <img src={plato.imagen} alt={plato.nombre} className="imagen-plato" />
                                    </div>
                                    <div className="info-plato">
                                        <div>
                                            <h3>{plato.nombre}</h3>
                                            <p className="descripcion-plato">{plato.descripcion}</p>
                                        </div>
                                        <div className="footer-plato">
                                            <span className="precio">S/ {plato.precio}</span>
                                            <div className="controles-cantidad">
                                                {pedido.find(item => item.id === plato.id) && (
                                                    <button className="btn-quitar" onClick={() => quitarPlato(plato)}>−</button>
                                                )}
                                                {pedido.find(item => item.id === plato.id) && (
                                                    <span>{pedido.find(item => item.id === plato.id).cantidad}</span>
                                                )}
                                                <button className="btn-agregar" onClick={() => agregarPlato(plato)}>
                                                    {pedido.find(item => item.id === plato.id) ? '+' : 'Agregar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="sidebar-reserva">
                    <div className="card-reserva">
                        <h2>Tu Reserva</h2>

                        <div className="grupo-input">
                            <label>Fecha</label>
                            <input
                                type="date"
                                value={fecha}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => { setFecha(e.target.value); setHora(''); setSlots(null); }}
                            />
                        </div>

                        <div className="grupo-input">
                            <label>Personas</label>
                            <select value={personas} onChange={(e) => { setPersonas(e.target.value); setHora(''); setSlots(null); }}>
                                {[1,2,3,4,5,6].map(n => (
                                    <option key={n} value={n}>{n} Persona{n > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grupo-input">
                            <label>Hora</label>
                            {!fecha ? (
                                <p className="aviso-slots">Selecciona una fecha para ver los horarios</p>
                            ) : slots === null ? (
                                <p className="aviso-slots">Cargando horarios...</p>
                            ) : slots.length === 0 ? (
                                <p className="aviso-slots">No hay horarios disponibles</p>
                            ) : (
                                <>
                                    <div className="grid-horas">
                                        {slots.map((s) => (
                                            <button
                                                key={s.hora}
                                                type="button"
                                                className={`slot-hora ${hora === s.hora ? 'activo' : ''} ${s.disponible && s.mesasLibres <= 2 ? 'pocas' : ''}`}
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

                        <div className="resumen-pedido">
                            <h3>Preorden</h3>
                            {pedido.length === 0 ? (
                                <p style={{color: '#9a958e', fontSize: '14px'}}>Aún no agregaste platos</p>
                            ) : (
                                pedido.map((item) => (
                                    <div key={item.id} className="item-resumen">
                                        <span>{item.nombre} x{item.cantidad}</span>
                                        <span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        {pedido.length > 0 && (
                            <div className="totales">
                                <div className="fila-total">
                                    <span>Subtotal</span>
                                    <span>S/ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="fila-total">
                                    <span>IGV (18%)</span>
                                    <span>S/ {igv.toFixed(2)}</span>
                                </div>
                                <div className="fila-total total-final">
                                    <span>Total</span>
                                    <span>S/ {total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {mensajeError && <p className="cr-alerta">{mensajeError}</p>}
                        {mensajeExito && <p className="cr-exito">{mensajeExito}</p>}

                        <button
                            className="btn-reservar"
                            onClick={procederPago}
                            disabled={cargandoPago}
                        >
                            {cargandoPago ? 'Procesando...' : 'Proceder con el pago'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContenidoRestaurante;