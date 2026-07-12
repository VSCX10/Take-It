import { NavLink } from 'react-router-dom';
import { NAV_GENERAL, NAV_RESTAURANTE, BASE_PATH } from './navConfig';

function Sidebar({ ambito, colapsado, onToggle }) {
  const items = ambito === 'general' ? NAV_GENERAL : NAV_RESTAURANTE;
  const base = BASE_PATH[ambito];

  return (
    <aside className={`am-sidebar${colapsado ? ' am-sidebar-colapsado' : ''}`}>
      <div className="am-sidebar-cabecera">
        <span className="am-sidebar-logo">
          Take<span>&</span>It {!colapsado && <em>Panel</em>}
        </span>
        <button className="am-sidebar-toggle" onClick={onToggle} aria-label="Colapsar menú">
          <i className={`ti ${colapsado ? 'ti-chevron-right' : 'ti-chevron-left'}`} />
        </button>
      </div>

      <nav className="am-sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={`${base}/${item.to}`}
            className={({ isActive }) => `am-sidebar-link${isActive ? ' activo' : ''}`}
            title={colapsado ? item.label : undefined}
          >
            <i className={`ti ${item.icon}`} />
            {!colapsado && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
