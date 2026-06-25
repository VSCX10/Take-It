import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
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
            .catch((error) => console.error("Error:", error));
    }, [id]);

    const subtotal = pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    const procederPago = async () => {
        if (!fecha || !hora) {
            alert('Por favor selecciona fecha y hora');
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
            }
        } catch (error) {
            alert('Error al procesar la reserva');
        } finally {
            setCargandoPago(false);
        }
    };

    if (!restaurante) return <p>Cargando...</p>;

    return (
        <div className="contenido-restaurante">

            {/* HEADER */}
            <div className="banner-restaurante">
            <img src={restaurante.img} alt={restaurante.nombre} className="imagen-banner" />
                <div className="overlay-banner">
                    <h1>{restaurante.nombre}</h1>
                    <div className="datos-restaurante">
                        <span>⭐ {restaurante.rating}</span>
                        <span>{restaurante.categoria}</span>
                        <span   span>📍 {restaurante.direccion}</span>
                    </div>
                </div>
            </div>

{/* BOTÓN VOLVER */}
<div className="contenedor-volver">
    <button className="btn-volver" onClick={() => navigate('/inicio')}>← Volver al inicio</button>
</div>

            <div className="layout-restaurante">

                {/* MENU */}
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

                {/* SIDEBAR RESERVA */}
                <div className="sidebar-reserva">
                    <div className="card-reserva">

                        {/* Cabecera */}
                        <div className="cr-reserva-header">
                            <span className="cr-reserva-tag">Tu Reserva</span>
                            <h2 className="cr-reserva-rest">{restaurante.nombre}</h2>
                            <div className="cr-reserva-deco" />
                        </div>

                        {/* Campos de fecha / hora / personas */}
                        <div className="cr-campos">
                            <div className="cr-campo">
                                <i className="ti ti-calendar cr-campo-icono" />
                                <div className="cr-campo-wrap">
                                    <label className="cr-campo-label">Fecha</label>
                                    <input
                                        type="date"
                                        className="cr-campo-input"
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="cr-campo">
                                <i className="ti ti-clock cr-campo-icono" />
                                <div className="cr-campo-wrap">
                                    <label className="cr-campo-label">Hora</label>
                                    <input
                                        type="time"
                                        className="cr-campo-input"
                                        value={hora}
                                        onChange={(e) => setHora(e.target.value)}
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
                                        onChange={(e) => setPersonas(e.target.value)}
                                    >
                                        {[1,2,3,4,5,6,7,8].map(n => (
                                            <option key={n} value={n}>{n} persona{n > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Sección preorden */}
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
                                    {pedido.map((item) => (
                                        <div key={item.id} className="cr-item">
                                            <div className="cr-item-info">
                                                <span className="cr-item-nombre">{item.nombre}</span>
                                                <span className="cr-item-precio">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                                            </div>
                                            <div className="cr-item-controles">
                                                <button className="cr-ctrl" onClick={() => quitarPlato(item)}>−</button>
                                                <span className="cr-ctrl-cant">{item.cantidad}</span>
                                                <button className="cr-ctrl" onClick={() => agregarPlato(item)}>+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Totales */}
                        {pedido.length > 0 && (
                            <div className="cr-totales">
                                <div className="cr-total-fila">
                                    <span>Subtotal</span>
                                    <span>S/ {subtotal.toFixed(2)}</span>
                                </div>
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

                        <button
                            className="cr-btn-confirmar"
                            onClick={procederPago}
                            disabled={cargandoPago}
                        >
                            {cargandoPago
                                ? <><i className="ti ti-loader-2 cr-spin" /> Procesando...</>
                                : <><i className="ti ti-check" /> Confirmar Reserva</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContenidoRestaurante;