export const NAV_GENERAL = [
  { to: 'dashboard', label: 'Dashboard', icon: 'ti-dashboard' },
  { to: 'restaurantes', label: 'Restaurantes', icon: 'ti-building-store' },
  { to: 'administradores', label: 'Administradores', icon: 'ti-users' },
  { to: 'configuracion', label: 'Configuración', icon: 'ti-settings' },
];

export const NAV_RESTAURANTE = [
  { to: 'reservas', label: 'Reservas', icon: 'ti-calendar' },
  { to: 'mesas', label: 'Mesas', icon: 'ti-armchair' },
  { to: 'promociones', label: 'Promociones', icon: 'ti-discount' },
  { to: 'resenas', label: 'Reseñas', icon: 'ti-star' },
];

export const BASE_PATH = {
  general: '/panel/general',
  restaurante: '/panel/restaurante',
};

export const TITULO_AMBITO = {
  general: 'Administrador General',
  restaurante: 'Administrador de Restaurante',
};
