import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Breadcrumbs from './Breadcrumbs';
import './AdminLayout.css';

function AdminLayout() {
  const [colapsado, setColapsado] = useState(false);
  const [abiertoMovil, setAbiertoMovil] = useState(false);

  return (
    <div className="am-shell">
      <div
        className={`am-sidebar-overlay${abiertoMovil ? ' visible' : ''}`}
        onClick={() => setAbiertoMovil(false)}
      />
      <div className={`am-sidebar-wrap${abiertoMovil ? ' am-sidebar-wrap-abierto' : ''}`}>
        <Sidebar colapsado={colapsado} onToggle={() => setColapsado((v) => !v)} />
      </div>

      <div className="am-contenido">
        <Topbar onToggleMobile={() => setAbiertoMovil((v) => !v)} />
        <main className="am-main">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
