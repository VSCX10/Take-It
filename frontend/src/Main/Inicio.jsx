import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css';

const HERO_SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80',
    tag: '✦ Lima, Perú',
    titulo: 'Experiencias gastronómicas inolvidables',
    sub: 'Reserva en los mejores restaurantes de la ciudad',
  },
  {
    img: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1400&q=80',
    tag: '✦ Destacado del mes',
    titulo: 'Alta cocina peruana, al alcance de tu mesa',
    sub: 'Descubre la fusión de sabores que conquista el mundo',
  },
  {
    img: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1400&q=80',
    tag: '✦ Ambiente & Diseño',
    titulo: 'Espacios que transforman la cena en arte',
    sub: 'Ambiente, diseño y gastronomía en perfecta armonía',
  },
  {
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80',
    tag: '✦ Mar & Sabor',
    titulo: 'Del Pacífico a tu plato, fresco cada día',
    sub: 'Las mejores cevicherías y marisquerías de Lima',
  },
];

function Inicio() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaActiva, setBusquedaActiva] = useState('');
  const [filtroEstrellas, setFiltroEstrellas] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [slideActual, setSlideActual] = useState(0);
  const navigate = useNavigate();
  const intervaloRef = useRef(null);

 
  useEffect(() => {
    fetch('http://localhost:3000/api/restaurantes')
      .then((r) => r.json())
      .then((datos) => { setRestaurantes(datos); setCargando(false); })
      .catch((err) => { console.error('Error:', err); setCargando(false); });
  }, []);

  // carrusel
  const irSlide = (n) => setSlideActual((n + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    intervaloRef.current = setInterval(() => irSlide(slideActual + 1), 5000);
    return () => clearInterval(intervaloRef.current);
  }, [slideActual]);

  // ── Filtros 
  const restaurantesFiltrados = restaurantes.filter((r) => {
    const coincideBusqueda =
      r.nombre.toLowerCase().includes(busquedaActiva.toLowerCase()) ||
      (r.categoria && r.categoria.toLowerCase().includes(busquedaActiva.toLowerCase()));

    const coincideEstrellas =
      filtroEstrellas === 'todas' || Math.floor(r.rating) >= Number(filtroEstrellas);

    const coincideTipo =
      filtroTipo === 'todos' || r.categoria === filtroTipo;

    return coincideBusqueda && coincideEstrellas && coincideTipo;
  });

  return (
    <div className="ti-pagina">

      {/* ── NAVEGADOR ──────────────────────────────────────────────────────── */}
      <header className="ti-nav">
        <h1 className="ti-logo">Take<span>&</span>It</h1>

        <p className="ti-nav-tagline">ADQUIERE TU MESA AL INSTANTE</p>

        <div className="ti-menu-wrap">
          <button
            className="ti-btn-hamburguesa"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú"
          >
            <span className={`ti-hamburguesa-icon ${menuAbierto ? 'abierto' : ''}`} />
          </button>

          {menuAbierto && (
            <div className="ti-menu-desplegable">
              <button onClick={() => navigate('/login')}>👤 Iniciar Sesión</button>
              <button onClick={() => navigate('/registro')}>📝 Registrarse</button>
            </div>
          )}
        </div>
      </header>

      {/* ── HERO CARRUSEL*/}
      <section className="ti-hero">
        <div
          className="ti-hero-slides"
          style={{ transform: `translateX(-${slideActual * 100}%)` }}
        >
          {HERO_SLIDES.map((s, i) => (
            <div key={i} className="ti-hero-slide">
              <img src={s.img} alt={s.titulo} />
              <div className="ti-hero-overlay" />
              <div className="ti-hero-contenido">
                <span className="ti-hero-tag">{s.tag}</span>
                <h2 className="ti-hero-titulo">{s.titulo}</h2>
                <p className="ti-hero-sub">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="ti-hero-flechas">
          <button className="ti-flecha" onClick={() => irSlide(slideActual - 1)}>‹</button>
          <button className="ti-flecha" onClick={() => irSlide(slideActual + 1)}>›</button>
        </div>

        <div className="ti-hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`ti-dot ${i === slideActual ? 'activo' : ''}`}
              onClick={() => setSlideActual(i)}
            />
          ))}
        </div>
      </section>

      <section className="ti-busqueda-seccion">
        <div className="ti-busqueda-wrap">
          <div className="ti-input-wrap">
            <span className="ti-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar restaurante, cocina, zona..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setBusquedaActiva(busqueda)}
            />
          </div>
          <button className="ti-btn-buscar" onClick={() => setBusquedaActiva(busqueda)}>
            Buscar
          </button>
        </div>
      </section>

      {/* ── FILTROS + LISTADO  */}
      <main className="ti-main">

        <div className="ti-cabecera-filtros">
          <div>
            <h2 className="ti-section-titulo">Restaurantes Destacados</h2>
            <p className="ti-section-sub">
              {restaurantesFiltrados.length} restaurante{restaurantesFiltrados.length !== 1 ? 's' : ''} disponible{restaurantesFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="ti-filtros">
            {/* Dropdown estrellas */}
            <div className="ti-dropdown-wrap">
              <label className="ti-filtro-label">Calificación</label>
              <select
                className="ti-dropdown"
                value={filtroEstrellas}
                onChange={(e) => setFiltroEstrellas(e.target.value)}
              >
                <option value="todas">Todas las estrellas</option>
                <option value="3">⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
              </select>
            </div>

            {/* Dropdown tipo de comida — opciones dinámicas desde el backend */}
            <div className="ti-dropdown-wrap">
              <label className="ti-filtro-label">Tipo de comida</label>
              <select
                className="ti-dropdown"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="todos">Todos los tipos</option>
                {[...new Set(restaurantes.map((r) => r.categoria).filter(Boolean))].sort().map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── GRID */}
        <div className="ti-grid">
          {cargando ? (
            <div className="ti-estado">Cargando restaurantes...</div>
          ) : restaurantesFiltrados.length === 0 ? (
            <div className="ti-estado">No se encontraron restaurantes con esos filtros.</div>
          ) : (
            restaurantesFiltrados.map((rest) => (
              <div key={rest.id} className="ti-tarjeta">
                <div className="ti-tarjeta-img">
                  <img src={rest.img} alt={rest.nombre} />
                  <span className="ti-badge-rating">⭐ {rest.rating}</span>
                  {rest.precio && (
                    <span className="ti-badge-precio">{rest.precio}</span>
                  )}
                </div>
                <div className="ti-tarjeta-body">
                  <h3 className="ti-tarjeta-nombre">{rest.nombre}</h3>
                  <p className="ti-tarjeta-categoria">{rest.categoria}</p>
                  <button
                    className="ti-btn-reserva"
                    onClick={() => navigate(`/restaurante/${rest.id}`)}
                  >
                    Ver Disponibilidad
                  </button>
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