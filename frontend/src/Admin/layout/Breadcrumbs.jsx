import { useLocation } from 'react-router-dom';

const ETIQUETAS = {
  dashboard: 'Dashboard',
  restaurantes: 'Restaurantes',
  reservas: 'Reservas',
};

function Breadcrumbs() {
  const { pathname } = useLocation();
  const seccion = pathname.split('/').filter(Boolean).pop();
  const etiqueta = ETIQUETAS[seccion] || seccion;

  return (
    <nav className="am-breadcrumbs">
      <span>Panel</span>
      <i className="ti ti-chevron-right" />
      <span className="am-breadcrumbs-actual">{etiqueta}</span>
    </nav>
  );
}

export default Breadcrumbs;
