import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Inicio.css';
import { useAuth } from '../context/AuthContext';

const CATEGORIAS = ['Todos', 'Nikkei', 'Peruana', 'Pescados y Mariscos', 'Contemporánea'];

function Inicio() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(false); 
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const navigate = useNavigate();
  const { cerrarSesion, usuarioActual } = useAuth();

  useEffect(() => {
    fetch('http://localhost:3000/api/restaurantes')
      .then((respuesta) => respuesta.json())
      .then((datos) => setRestaurantes(datos))
      .catch((error) => console.error("Error:", error));
  }, []);

  const restaurantesFiltrados = categoriaActiva === 'Todos'
    ? restaurantes
    : restaurantes.filter(r => r.categoria === categoriaActiva);

  return (
    <div className="inicio-contenedor">
      <header className="navbar">
        <h1 className="logo">Take<span className="logo-acento">&</span>It</h1>
        <div className="buscador">
          <input type="text" placeholder="🔍 Buscar restaurante, comida..." />
        </div>
        
        <div className="menu-hamburguesa-contenedor">
          <button 
            className="btn-hamburguesa"
            onClick={() => setMenuAbierto(!menuAbierto)} 
          >
            ☰
          </button>

          {menuAbierto && (
            <div className="menu-desplegable">
              {usuarioActual ? (
                <>
                  <p className="menu-saludo">👋 Hola, {usuarioActual.nombre}</p>
                  <button onClick={() => { cerrarSesion(); navigate('/login'); }}>
                    🚪 Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')}>👤 Iniciar Sesión</button>
                  <button onClick={() => navigate('/registro')}>📝 Registrarse</button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="contenido">
        <div className="cabecera-filtros">
          <div>
            <h2>Restaurantes Destacados</h2>
            <p className="subtitulo">Explora opciones para reservar este mes</p>
          </div>
        </div>

        {/* FILTROS POR CATEGORÍA */}
        <div className="filtros-categorias">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              className={`btn-categoria ${categoriaActiva === cat ? 'activo' : ''}`}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid-restaurantes">
          {restaurantesFiltrados.length === 0 ? (
            <p>Cargando restaurantes desde el servidor...</p>
          ) : (
            restaurantesFiltrados.map((rest) => (
              <div key={rest.id} className="tarjeta">
                <div className="imagen-contenedor">
                  <img src={rest.img} alt={rest.nombre} className="imagen-restaurante" />
                  <span className="etiqueta-rating">⭐ {rest.rating}</span>
                </div>
                <div className="info-restaurante">
                  <h3>{rest.nombre}</h3>
                  <p>{rest.categoria}</p>
                  <button className="btn-reserva">Ver Disponibilidad</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Inicio;