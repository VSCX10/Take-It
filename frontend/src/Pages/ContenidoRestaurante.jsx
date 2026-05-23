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
        const platoExistente = pedido.find(
            (item) => item.id === plato.id
        );
        if (platoExistente) {
            const nuevoPedido = pedido.map((item) => item.id === plato.id
                ? {
                    ...item,
                    cantidad: item.cantidad +1
                }
                : item
            );
            setPedido(nuevoPedido);
        } else{
            setPedido([
                ...pedido,
                {
                    ...plato,
                    cantidad: 1,
                }
            ]);
        }

    }
    useEffect(() => {
        fetch('http://localhost:3000/api/restaurantes')
            .then((res) => res.json())
            .then((data) => {
                const restEncontrado = data.find(
                    (r) => r.id === parseInt(id)
                );

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
                <img
                    src={restaurante.img}
                    alt={restaurante.nombre}
                    className="imagen-banner"
                />

                <div className="overlay-banner">
                    <h1>{restaurante.nombre}</h1>

                    <div className="datos-restaurante">
                        <span>⭐ {restaurante.rating}</span>
                        <span>{restaurante.categoria}</span>
                    </div>
                </div>
            </div>

            {/* TITULO */}
            <div className="cabecera-menu">
                <h2>Menú Disponible</h2>
                <p>Selecciona tus platos para la preorden</p>
            </div>

            {/* GRID PLATOS */}
            <div className="grid-platos">
                {menu.length === 0 ? (
                    <p>No hay platos disponibles</p>
                ) : (
                    menu.map((plato) => (
                        <div key={plato.id} className="tarjeta-plato">

                            <div className="contenedor-imagen-plato">
                                <img
                                    src={plato.imagen}
                                    alt={plato.nombre}
                                    className="imagen-plato"
                                />
                            </div>

                            <div className="info-plato">
                                <h3>{plato.nombre}</h3>

                                <p className="descripcion-plato">
                                    {plato.descripcion}
                                </p>

                                <div className="footer-plato">
                  <span className="precio">
                    S/ {plato.precio}
                  </span>

                                    <button className="btn-agregar">
                                        Agregar
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>
            <div className="Reserva">
                <h2>Tu reserva</h2>
                <div className="fecha-hora">
                    <label>Fecha y Hora</label>
                    <div className="inputs-inline">
                        <input type="date" />
                        <input type="time" />
                    </div>
                    <div>
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
                </div>
                <div className="pre-orden">
                    <p></p>
                    <p>Subtotal e IGV xd</p>
                    <p>Total</p>
                </div>
                <button>Proceder con el pago</button>
            </div>
        </div>
    );


}

export default ContenidoRestaurante;