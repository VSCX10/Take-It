import { useLocation } from 'react-router-dom';
import { TITULO_AMBITO } from './navConfig';

const ETIQUETAS = {
  dashboard: 'Dashboard',
  restaurantes: 'Restaurantes',
  administradores: 'Administradores',
  configuracion: 'Configuración',
  reservas: 'Reservas',
  mesas: 'Mesas',
  promociones: 'Promociones',
  resenas: 'Reseñas',
};

function Breadcrumbs({ ambito }) {
  const { pathname } = useLocation();
  const seccion = pathname.split('/').filter(Boolean).pop();
  const etiqueta = ETIQUETAS[seccion] || seccion;

  return (
    <nav className="am-breadcrumbs" aria-label="breadcrumb">
      <span>{TITULO_AMBITO[ambito]}</span>
      <i className="ti ti-chevron-right" />
      <span className="am-breadcrumbs-activo">{etiqueta}</span>
    </nav>
  );
}

export default Breadcrumbs;
