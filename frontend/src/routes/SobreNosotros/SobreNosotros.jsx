import { useNavigate } from 'react-router-dom';
import './SobreNosotros.css';

const FEATURES = [
  { icon: 'ti-lock', titulo: 'Autenticación segura', desc: 'Registro e inicio de sesión con tokens JWT y contraseñas hasheadas con bcrypt.' },
  { icon: 'ti-search', titulo: 'Búsqueda & Filtros', desc: 'Encuentra restaurantes por nombre, tipo de cocina y calificación de estrellas.' },
  { icon: 'ti-file-text', titulo: 'Menú Digital', desc: 'Carta completa de cada restaurante con precios, descripciones y descuentos.' },
  { icon: 'ti-calendar-event', titulo: 'Reservas por mesa', desc: 'Disponibilidad real por horario: cada bloque sabe cuántas mesas quedan libres.' },
  { icon: 'ti-history', titulo: 'Historial de reservas', desc: 'Revisa el estado de cada reserva: pendiente, confirmada o cancelada.' },
  { icon: 'ti-shopping-cart', titulo: 'Preorden & Pago', desc: 'Arma tu pedido y paga en el local o con tarjeta antes de llegar.' },
];

const STACK = [
  { icon: 'ti-brand-react', color: '#61dafb', nombre: 'React 19', desc: 'Frontend · Componentes' },
  { icon: 'ti-server', color: '#68a063', nombre: 'Node + Express 5', desc: 'Backend · API REST' },
  { icon: 'ti-database', color: '#336791', nombre: 'Neon PostgreSQL', desc: 'Base de datos cloud' },
  { icon: 'ti-shield-lock', color: '#c2440e', nombre: 'JWT + bcrypt', desc: 'Autenticación segura' },
  { icon: 'ti-rocket', color: '#9333ea', nombre: 'Vite 8', desc: 'Bundler · Hot-reload' },
  { icon: 'ti-git-branch', color: '#f97316', nombre: 'GitHub', desc: 'Ramas por integrante' },
];

const STATS = [
  { num: 'ODS 9', label: 'Innovación e Infraestructura' },
  { num: 'JWT', label: 'Autenticación sin estado' },
  { num: 'Scrum', label: 'Desarrollo ágil por sprints' },
];

const EQUIPO = [
  { nombre: 'Rodrigo Arrieta del Águila', rol: 'Líder de Proyecto & Diseño UI/UX', animal: 'Águila', img: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=300&q=80', inicial: 'R' },
  { nombre: 'Renato Santin Vilchez', rol: 'Product Owner & Frontend', animal: 'León', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=300&q=80', inicial: 'R' },
  { nombre: 'Victor Sevillano Castro', rol: 'Desarrollador Backend & Base de Datos', animal: 'Búho', img: 'https://images.unsplash.com/photo-1543702571-acf7b1bb56b1?w=300&q=80', inicial: 'V' },
  { nombre: 'Jairo Gutierrez Toribio', rol: 'Desarrollador Frontend & Preorden', animal: 'Zorro', img: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=300&q=80', inicial: 'J' },
  { nombre: 'Antony Lopez Auqui', rol: 'Desarrollador Frontend & Pruebas', animal: 'Lobo', img: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=300&q=80', inicial: 'A' },
  { nombre: 'Jeremin Roman Gabriel', rol: 'Desarrollador Frontend & Preorden', animal: 'Tigre', img: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=300&q=80', inicial: 'J' },
];

function SobreNosotros() {
  const navigate = useNavigate();

  return (
    <div className="sn-pagina">

      {/* ── TOP BAR ───────────────────────────────────────── */}
      <header className="sn-topbar">
        <span className="sn-logo">Take<span>&amp;</span>It</span>
        <button className="sn-volver" onClick={() => navigate('/inicio')}>
          <i className="ti ti-arrow-left" aria-hidden="true" />
          Volver al inicio
        </button>
      </header>

      <main className="sn-wrap">

        {/* ── HERO ────────────────────────────────────────── */}
        <section className="sn-hero">
          <div className="sn-hero-glow" />
          <div className="sn-hero-texto">
            <span className="sn-pill sn-pill-claro">
              <i className="ti ti-building" aria-hidden="true" />
              Universidad de Lima · Ingeniería de Sistemas · Grupo 4
            </span>
            <h1 className="sn-hero-titulo">
              Sobre <span className="sn-grad">Take&amp;It</span>
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
          </div>
        </section>

        {/* ── ¿POR QUÉ TAKE&IT? (2 columnas) ──────────────── */}
        <section className="sn-porque">
          <div className="sn-porque-info">
            <span className="sn-label">El Problema</span>
            <h2 className="sn-titulo">¿Por qué Take&amp;It?</h2>
            <p>
              El sector gastronómico limeño enfrenta un problema central: la ineficiencia
              en la gestión de reservas. Largos tiempos de espera, falta de herramientas
              digitales y desorganización generan insatisfacción tanto en comensales como
              en restaurantes.
            </p>
            <p>
              <strong>Take&amp;It</strong> surge como respuesta: una plataforma web que actúa
              como intermediario digital, permitiendo reservar mesas y realizar pedidos
              anticipados desde cualquier dispositivo, antes de llegar al restaurante.
            </p>
          </div>

          <div className="sn-stats">
            {STATS.map((s, i) => (
              <div key={i} className="sn-stat">
                <span className="sn-stat-num">{s.num}</span>
                <span className="sn-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── FUNCIONALIDADES (bento) ─────────────────────── */}
        <section className="sn-bloque">
          <span className="sn-label">Lo que construimos</span>
          <h2 className="sn-titulo">Funcionalidades</h2>
          <div className="sn-bento">
            {FEATURES.map((f, i) => (
              <article key={i} className="sn-feat">
                <div className="sn-feat-icon">
                  <i className={`ti ${f.icon}`} aria-hidden="true" />
                </div>
                <h4>{f.titulo}</h4>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── STACK ───────────────────────────────────────── */}
        <section className="sn-bloque">
          <span className="sn-label">Tecnología</span>
          <h2 className="sn-titulo">El stack que nos impulsa</h2>
          <div className="sn-stack">
            {STACK.map((t, i) => (
              <div key={i} className="sn-tech">
                <i className={`ti ${t.icon}`} style={{ color: t.color }} aria-hidden="true" />
                <div>
                  <strong>{t.nombre}</strong>
                  <span>{t.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── EQUIPO (heading lateral + grid) ─────────────── */}
        <section className="sn-equipo">
          <div className="sn-equipo-glow" />
          <div className="sn-equipo-head">
            <span className="sn-label sn-label-claro">El Equipo</span>
            <h2 className="sn-titulo sn-titulo-claro">Quiénes somos</h2>
            <p className="sn-equipo-sub">
              Estudiantes de Ingeniería de Sistemas de la Universidad de Lima,
              apasionados por construir soluciones digitales de impacto real en
              Lima, Perú.
            </p>
          </div>
          <div className="sn-equipo-grid">
            {EQUIPO.map((m, i) => (
              <div key={i} className="sn-miembro">
                <div className="sn-av">
                  <img
                    src={m.img}
                    alt={m.animal}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                  <div className="sn-av-fb" style={{ display: 'none' }}>{m.inicial}</div>
                </div>
                <span className="sn-miembro-animal">{m.animal}</span>
                <h4 className="sn-miembro-nombre">{m.nombre}</h4>
                <p className="sn-miembro-rol">{m.rol}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA (banda horizontal) ──────────────────────── */}
        <section className="sn-cta">
          <div className="sn-cta-glow" />
          <div className="sn-cta-texto">
            <h2>¿Listo para reservar?</h2>
            <p>Descubre los mejores restaurantes de Lima y asegura tu mesa en segundos.</p>
          </div>
          <button className="sn-cta-btn" onClick={() => navigate('/inicio')}>
            Explorar restaurantes
            <i className="ti ti-arrow-right" aria-hidden="true" />
          </button>
        </section>

        <footer className="sn-foot">
          <span className="sn-logo sn-logo-sm">Take<span>&amp;</span>It</span>
          <span>© 2026 · Universidad de Lima · Todos los derechos reservados</span>
        </footer>

      </main>
    </div>
  );
}

export default SobreNosotros;
