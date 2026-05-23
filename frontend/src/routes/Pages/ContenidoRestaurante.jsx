import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import "./ContenidoRestaurante.css";

function ContenidoRestaurante() {
    const {id} = useParams();
    const [menu, setMenu] = useState([]);
    const [restaurante, setRestaurante] = useState(null);
    const [pedido, setPedido] = useState([]);
    const navigate = useNavigate();

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

    useEffect(() => {
        fetch('http://localhost:3000/api/restaurantes')
            .then((res) => res.json())
            .then((data) => {
                const restEncontrado = data.find((r) => r.id === parseInt(id));
                setRestaurante(restEncontrado);
            });
        fetch(`http://localhost:3000/api/restaurantes/${id}/menu`)
            .then((res) => res.json())
            .then((datos) => setMenu(datos))
            .catch((error) => console.error("Error:", error));
    }, [id]);

    if (!restaurante) {
        return <p>Cargando...</p>;
    }

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
                    </div>
                </div>
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
                                            <button className="btn-agregar" onClick={() => agregarPlato(plato)}>
                                                Agregar
                                            </button>
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
                        <h2>Tu Reserva</h2>

                        <div className="grupo-input">
                            <label>Fecha</label>
                            <input type="date" />
                        </div>

                        <div className="grupo-input">
                            <label>Hora</label>
                            <input type="time" />
                        </div>

                        <div className="grupo-input">
                            <label>Personas</label>
                            <select>
                                <option>1 Persona</option>
                                <option>2 Personas</option>
                                <option>3 Personas</option>
                                <option>4 Personas</option>
                                <option>5 Personas</option>
                                <option>6 Personas</option>
                            </select>
                        </div>

                        {/* RESUMEN */}
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
                                    <span>S/ {pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}</span>
                                </div>
                                <div className="fila-total">
                                    <span>IGV (18%)</span>
                                    <span>S/ {(pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0) * 0.18).toFixed(2)}</span>
                                </div>
                                <div className="fila-total total-final">
                                    <span>Total</span>
                                    <span>S/ {(pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0) * 1.18).toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        <button className="btn-reservar">Proceder con el pago</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ContenidoRestaurante;