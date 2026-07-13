import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css';
import { useAuth } from '../context/AuthContext';
import { authHeaders } from '../utils/authHeaders';

const HERO_SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80',
    tag: '✦ Lima, Perú',
    titulo: 'Experiencias gastronómicas inolvidables',
    sub: 'Reserva en los mejores restaurantes de la ciudad en segundos',
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

function describirPromo(platos) {
  const nombres = platos.map(p => p.nombre);
  const lista = nombres.length === 1
    ? nombres[0]
    : `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
  return `Descuento en ${lista}.`;
}

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Restaurantes', href: '#restaurantes' },
  { label: 'Promociones', href: '#promociones' },
  { label: 'Sobre Nosotros', href: null, to: '/nosotros' },
];

function Inicio() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [promos, setPromos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstrellas, setFiltroEstrellas] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [slideActual, setSlideActual] = useState(0);
  const navigate = useNavigate();
  const { cerrarSesion, usuarioActual } = useAuth();
  const intervaloRef = useRef(null);
  const restaurantesRef = useRef(null);

  useEffect(() => {
    fetch('/api/restaurantes')
      .then((r) => r.json())
      .then((datos) => { setRestaurantes(datos.data); setCargando(false); })
      .catch((err) => { console.error('Error:', err); setCargando(false); });

    fetch('/api/restaurantes/promociones')
      .then((r) => r.json())
      .then((datos) => setPromos(datos.data || []))
      .catch(() => setPromos([]));
  }, []);

  useEffect(() => {
    if (!usuarioActual) return;
    fetch(`/api/favoritos/${usuarioActual.id}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((datos) => setFavoritos((datos.data || []).map((f) => f.restauranteId)))
      .catch(() => setFavoritos([]));
  }, [usuarioActual]);

  const toggleFavorito = (e, restauranteId) => {
    e.stopPropagation();
    const esFavorito = favoritos.includes(restauranteId);

    setFavoritos((prev) =>
      esFavorito ? prev.filter((id) => id !== restauranteId) : [...prev, restauranteId]
    );

    if (esFavorito) {
      fetch(`/api/favoritos/${usuarioActual.id}/${restauranteId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      }).catch(() => setFavoritos((prev) => [...prev, restauranteId]));
    } else {
      fetch('/api/favoritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ usuarioId: usuarioActual.id, restauranteId }),
      }).catch(() => setFavoritos((prev) => prev.filter((id) => id !== restauranteId)));
    }
  };

  const irSlide = (n) => setSlideActual((n + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    intervaloRef.current = setInterval(() => irSlide(slideActual + 1), 5000);
    return () => clearInterval(intervaloRef.current);
  }, [slideActual]);

  const scrollToRestaurantes = () => {
    restaurantesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const restaurantesFiltrados = restaurantes.filter((r) => {
    const coincideBusqueda =
      r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (r.categoria && r.categoria.toLowerCase().includes(busqueda.toLowerCase()));
    const coincideEstrellas =
      filtroEstrellas === 'todas' || Math.floor(r.rating) >= Number(filtroEstrellas);
    const coincideTipo =
      filtroTipo === 'todos' || r.categoria === filtroTipo;
    const coincideFavorito = !soloFavoritos || favoritos.includes(r.id);
    return coincideBusqueda && coincideEstrellas && coincideTipo && coincideFavorito;
  });

  const inicialUsuario = usuarioActual?.nombre?.[0]?.toUpperCase() || '';

  return (
    <div className="ti-pagina" id="inicio">

      <header className="ti-nav">
        <h1 className="ti-logo">Take<span>&</span>It</h1>

        <nav className="ti-nav-links">
          {NAV_LINKS.map((l) =>
            l.to ? (
              <button
                key={l.label}
                className="ti-nav-link ti-nav-link-btn"
                onClick={() => navigate(l.to)}
              >
                {l.label}
              </button>
            ) : (
              <a key={l.label} className="ti-nav-link" href={l.href}>{l.label}</a>
            )
          )}
        </nav>

        <div className="ti-nav-acciones">
          <div className="ti-menu-wrap">
            <button
              className="ti-avatar"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label="Menú de usuario"
            >
              {usuarioActual?.foto
                ? <img src={usuarioActual.foto} className="ti-avatar-foto" alt="" />
                : (usuarioActual ? inicialUsuario : '☰')
              }
            </button>

            {menuAbierto && (
              <div className="ti-menu-desplegable">
                {usuarioActual ? (
                  <>
                    <p className="ti-menu-saludo">👋 Hola, {usuarioActual.nombre}</p>
                    <button onClick={() => { navigate('/perfil'); setMenuAbierto(false); }}>
                      👤 Mi Perfil
                    </button>
                    <button onClick={() => { navigate('/favoritos'); setMenuAbierto(false); }}>
                      ❤️ Mis Favoritos
                    </button>
                    {usuarioActual.rol === 'admin_general' && (
                      <button onClick={() => { navigate('/panel/general/dashboard'); setMenuAbierto(false); }}>
                        🛠️ Panel Admin
                      </button>
                    )}
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
        </div>
      </header>

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
                <button className="ti-hero-cta" onClick={scrollToRestaurantes}>
                  Explorar Restaurantes →
                </button>
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

      <div className="ti-search-float-wrap">
        <div className="ti-search-float">
          <span className="ti-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar restaurante, cocina, zona..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') scrollToRestaurantes(); }}
          />
          <button className="ti-btn-buscar" onClick={scrollToRestaurantes}>
            Buscar
          </button>
        </div>
      </div>

      <main className="ti-main" ref={restaurantesRef} id="restaurantes">
        <div className="ti-cabecera-filtros">
          <div>
            <h2 className="ti-section-titulo">Restaurantes Destacados</h2>
            <div className="ti-titulo-deco" />
            <p className="ti-section-sub">
              {restaurantesFiltrados.length} restaurante{restaurantesFiltrados.length !== 1 ? 's' : ''} disponible{restaurantesFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="ti-filtros">
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
            <button
              className={`ti-btn-filtro-favoritos${soloFavoritos ? ' activo' : ''}`}
              onClick={() => setSoloFavoritos((prev) => !prev)}
            >
              <i className="ti ti-heart" /> Favoritos
            </button>
          </div>
        </div>

        <div className="ti-grid">
          {cargando ? (
            <div className="ti-estado">Cargando restaurantes...</div>
          ) : restaurantesFiltrados.length === 0 ? (
            <div className="ti-estado">No se encontraron restaurantes con esos filtros.</div>
          ) : (
            restaurantesFiltrados.map((rest) => (
              <div
                key={rest.id}
                className="ti-tarjeta"
                onClick={() => navigate(`/contenido/${rest.id}`)}
              >
                <div className="ti-tarjeta-img">
                  <img src={rest.img} alt={rest.nombre} />
                  <div className="ti-tarjeta-overlay">
                    <button
                      className="ti-btn-reserva-overlay"
                      onClick={(e) => { e.stopPropagation(); navigate(`/contenido/${rest.id}`); }}
                    >
                      Ver Disponibilidad →
                    </button>
                  </div>
                  <button
                    className={`ti-btn-favorito${favoritos.includes(rest.id) ? ' activo' : ''}`}
                    onClick={(e) => toggleFavorito(e, rest.id)}
                    aria-label="Marcar como favorito"
                    title={favoritos.includes(rest.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <i className="ti ti-heart" />
                  </button>
                  <span className="ti-badge-rating">⭐ {rest.rating}</span>
                  {rest.precio && <span className="ti-badge-precio">{rest.precio}</span>}
                </div>
                <div className="ti-tarjeta-body">
                  <span className="ti-tarjeta-pill">{rest.categoria}</span>
                  <h3 className="ti-tarjeta-nombre">{rest.nombre}</h3>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {promos.length > 0 && (
        <section className="ti-promos" id="promociones">
          <div className="ti-promos-inner">
            <div className="ti-promos-header">
              <h2 className="ti-section-titulo">Promociones Exclusivas</h2>
              <div className="ti-titulo-deco" />
              <p className="ti-section-sub">Descuentos vigentes en la carta de los mejores restaurantes de Lima</p>
            </div>
            <div className="ti-promos-grid">
              {promos.map((p) => (
                <div key={p.restauranteId} className="ti-promo-card">
                  <div className="ti-promo-img-wrap">
                    <img src={p.img} alt={p.nombre} />
                    <span className="ti-promo-badge">-{p.descuentoMax}%</span>
                    <span className="ti-promo-etiqueta">
                      {p.platos.length} plato{p.platos.length > 1 ? 's' : ''} en oferta
                    </span>
                  </div>
                  <div className="ti-promo-body">
                    <span className="ti-tarjeta-pill">{p.categoria}</span>
                    <h3 className="ti-promo-restaurante">{p.nombre}</h3>
                    <p className="ti-promo-desc">{describirPromo(p.platos)}</p>
                    <div className="ti-promo-web">
                      <i className="ti ti-world" /> Válido solo por WEB
                    </div>
                    <button
                      className="ti-btn-reserva"
                      onClick={() => navigate(`/contenido/${p.restauranteId}`)}
                    >
                      Aprovechar Oferta →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

export default Inicio;
