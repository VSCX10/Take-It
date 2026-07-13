import { NavLink } from 'react-router-dom';
import { NAV, BASE_PATH } from './navConfig';

function Sidebar({ colapsado, onToggle }) {
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
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={`${BASE_PATH}/${item.to}`}
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
