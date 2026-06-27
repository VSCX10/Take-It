import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SobreNosotros.css';

const FOOD_STRIP = [
  { img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=70', label: 'Alta Cocina' },
  { img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=70', label: 'Fusión Nikkei' },
  { img: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&q=70', label: 'Mariscos' },
  { img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=70', label: 'Peruana' },
  { img: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&q=70', label: 'Grill' },
  { img: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&q=70', label: 'Postres' },
];

const FEATURES = [
  { icon: 'ti-lock', titulo: 'Autenticación JWT', desc: 'Registro e inicio de sesión con sesión persistente y segura mediante tokens.' },
  { icon: 'ti-search', titulo: 'Búsqueda & Filtros', desc: 'Encuentra restaurantes por nombre, tipo de cocina y calificación de estrellas.' },
  { icon: 'ti-file-text', titulo: 'Menú Digital', desc: 'Visualiza la carta completa de cada restaurante con precios y descripción.' },
  { icon: 'ti-user', titulo: 'Perfil de Usuario', desc: 'Gestiona tus datos personales y consulta tus reservas activas en tiempo real.' },
  { icon: 'ti-history', titulo: 'Historial de Reservas', desc: 'Revisa el estado actual de cada una de tus reservas: pendiente, confirmada o cancelada.' },
  { icon: 'ti-shopping-cart', titulo: 'Interfaz de Preorden', desc: 'Selecciona platos, horario y número de personas antes de llegar al restaurante.' },
];

const EQUIPO = [
  {
    nombre: 'Rodrigo Arrieta del Águila',
    rol: 'Líder de Proyecto & Diseño UI/UX',
    animal: 'Águila',
    img: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=300&q=80',
    inicial: 'R',
  },
  {
    nombre: 'Renato Santin Vilchez',
    rol: 'Product Owner & Frontend',
    animal: 'León',
    img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=300&q=80',
    inicial: 'R',
  },
  {
    nombre: 'Victor Sevillano Castro',
    rol: 'Desarrollador Backend & Base de Datos',
    animal: 'Búho',
    img: 'https://images.unsplash.com/photo-1543702571-acf7b1bb56b1?w=300&q=80',
    inicial: 'V',
  },
  {
    nombre: 'Jairo Gutierrez Toribio',
    rol: 'Desarrollador Frontend & Preorden',
    animal: 'Zorro',
    img: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=300&q=80',
    inicial: 'J',
  },
  {
    nombre: 'Antony Lopez Auqui',
    rol: 'Desarrollador Frontend & Pruebas',
    animal: 'Lobo',
    img: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=300&q=80',
    inicial: 'A',
  },
  {
    nombre: 'Jeremin Roman Gabriel',
    rol: 'Desarrollador Frontend & Preorden',
    animal: 'Tigre',
    img: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=300&q=80',
    inicial: 'J',
  },
];

function SobreNosotros() {
  const navigate = useNavigate();

  return (
    <div className="sn-pagina">

      {/* ── SIDEBAR IZQUIERDO (fijo) ──────────────────────────────────── */}
      <aside className="sn-sidebar">
        <button className="sn-volver" onClick={() => navigate('/inicio')}>
          <i className="ti ti-arrow-left" aria-hidden="true" />
          Volver
        </button>

        <div className="sn-food-strip">
          {FOOD_STRIP.map((f, i) => (
            <div key={i} className="sn-food-item">
              <img src={f.img} alt={f.label} />
              <span className="sn-food-label">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="sn-sidebar-footer">
          <span className="sn-logo-side">Take<em>&</em>It</span>
          <span className="sn-year-side">Lima · 2026</span>
        </div>
      </aside>

      {/* ── CONTENIDO DERECHO ─────────────────────────────────────────── */}
      <main className="sn-content">

        {/* HERO */}
        <section className="sn-hero">
          <div className="sn-hero-tag">
            <i className="ti ti-building" aria-hidden="true" />
            Universidad de Lima · Ingeniería de Sistemas · Grupo 4
          </div>
          <h1 className="sn-hero-titulo">
            Sobre<br />Take<span>&</span>It
          </h1>
          <p className="sn-hero-sub">
            Una plataforma que digitaliza la experiencia gastronómica de Lima,
            conectando comensales con los mejores restaurantes de la ciudad
            antes de que pongan un pie en ellos.
          </p>
          <div className="sn-hero-chips">
            <span className="sn-chip"><i className="ti ti-book" aria-hidden="true" />Ingeniería de Software</span>
            <span className="sn-chip"><i className="ti ti-tag" aria-hidden="true" />Release 2 · 2026</span>
            <span className="sn-chip"><i className="ti ti-world" aria-hidden="true" />App Web · Full Stack</span>
          </div>
        </section>

        {/* POR QUÉ TAKE&IT */}
        <section className="sn-porque">
          <div className="sn-sec-inner">
            <p className="sn-label-sup">El Problema</p>
            <h2 className="sn-sec-titulo">¿Por qué Take&amp;It?</h2>
            <div className="sn-deco" />
            <div className="sn-porque-cols">
              <p>
                El sector gastronómico limeño enfrenta un problema central: la ineficiencia
                en la gestión de reservas. Largos tiempos de espera, falta de herramientas
                digitales y desorganización en la atención al cliente generan insatisfacción
                tanto en los comensales como en los restaurantes.
              </p>
              <p>
                <strong>Take&amp;It</strong> surge como respuesta: una plataforma web que actúa
                como intermediario digital entre comensales y restaurantes, permitiendo
                reservar mesas y realizar pedidos anticipados desde cualquier dispositivo,
                antes de llegar al restaurante.
              </p>
            </div>
          </div>
          <div className="sn-stats-bar">
            <div className="sn-stat">
              <span className="sn-stat-num">ODS 9</span>
              <span className="sn-stat-label">Innovación e Infraestructura</span>
            </div>
            <div className="sn-stat-div" />
            <div className="sn-stat">
              <span className="sn-stat-num">JWT</span>
              <span className="sn-stat-label">Autenticación segura sin estado</span>
            </div>
            <div className="sn-stat-div" />
            <div className="sn-stat">
              <span className="sn-stat-num">Scrum</span>
              <span className="sn-stat-label">Desarrollo ágil por sprints</span>
            </div>
          </div>
        </section>

        {/* FUNCIONALIDADES */}
        <section className="sn-features">
          <div className="sn-sec-inner">
            <p className="sn-label-sup sn-label-light">Release 1</p>
            <h2 className="sn-sec-titulo sn-titulo-light">Lo que construimos</h2>
            <div className="sn-deco sn-deco-light" />
            <div className="sn-feat-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="sn-feat-card">
                  <div className="sn-feat-icon-wrap">
                    <i className={`ti ${f.icon}`} aria-hidden="true" />
                  </div>
                  <h4 className="sn-feat-titulo">{f.titulo}</h4>
                  <p className="sn-feat-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STACK TÉCNICO */}
        <section className="sn-stack">
          <div className="sn-sec-inner">
            <p className="sn-label-sup">Stack Técnico</p>
            <h2 className="sn-sec-titulo">Tecnología que nos impulsa</h2>
            <div className="sn-deco" />
            <div className="sn-stack-grid">
              <div className="sn-stack-item">
                <i className="ti ti-brand-react sn-stack-icon" style={{ color: '#61dafb' }} aria-hidden="true" />
                <div>
                  <strong>React 19</strong>
                  <span>Frontend · Componentes reutilizables</span>
                </div>
              </div>
              <div className="sn-stack-item">
                <i className="ti ti-server sn-stack-icon" style={{ color: '#68a063' }} aria-hidden="true" />
                <div>
                  <strong>Node.js + Express 5</strong>
                  <span>Backend · API REST por capas</span>
                </div>
              </div>
              <div className="sn-stack-item">
                <i className="ti ti-database sn-stack-icon" style={{ color: '#336791' }} aria-hidden="true" />
                <div>
                  <strong>Neon PostgreSQL</strong>
                  <span>Base de datos · Cloud-native</span>
                </div>
              </div>
              <div className="sn-stack-item">
                <i className="ti ti-shield-lock sn-stack-icon" style={{ color: '#c2440e' }} aria-hidden="true" />
                <div>
                  <strong>JWT</strong>
                  <span>Autenticación · Sesión sin estado</span>
                </div>
              </div>
              <div className="sn-stack-item">
                <i className="ti ti-rocket sn-stack-icon" style={{ color: '#9333ea' }} aria-hidden="true" />
                <div>
                  <strong>Vite 8</strong>
                  <span>Bundler · Hot-reload instantáneo</span>
                </div>
              </div>
              <div className="sn-stack-item">
                <i className="ti ti-git-branch sn-stack-icon" style={{ color: '#f97316' }} aria-hidden="true" />
                <div>
                  <strong>GitHub</strong>
                  <span>Control de versiones · Ramas por integrante</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUIÉNES SOMOS */}
        <section className="sn-equipo">
          <p className="sn-label-sup sn-label-light">El Equipo</p>
          <h2 className="sn-sec-titulo sn-titulo-light">Quiénes somos</h2>
          <div className="sn-deco sn-deco-light" />
          <p className="sn-equipo-sub">
            Estudiantes de Ingeniería de Sistemas de la Universidad de Lima,<br />
            apasionados por construir soluciones digitales de impacto real en Lima, Perú.
          </p>
          <div className="sn-equipo-grid">
            {EQUIPO.map((m, i) => (
              <div key={i} className="sn-miembro">
                <div className="sn-av-wrap">
                  <img
                    src={m.img}
                    alt={m.animal}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                  <div className="sn-av-fallback" style={{ display: 'none' }}>{m.inicial}</div>
                </div>
                <div className="sn-miembro-animal">{m.animal}</div>
                <h4 className="sn-miembro-nombre">{m.nombre}</h4>
                <p className="sn-miembro-rol">{m.rol}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="sn-footer">
          <div className="sn-footer-left">
            <span className="sn-footer-logo">Take<em>&</em>It</span>
            <span className="sn-footer-copy">© 2026 Take&It · Universidad de Lima · Todos los derechos reservados</span>
          </div>
          <button className="sn-footer-btn" onClick={() => navigate('/inicio')}>
            <i className="ti ti-arrow-left" aria-hidden="true" />
            Explorar Restaurantes
          </button>
        </footer>

      </main>
    </div>
  );
}

export default SobreNosotros;
