import './components.css';

const TONOS = {
  pendiente: 'am-badge-ambar',
  confirmada: 'am-badge-verde',
  aprobada: 'am-badge-verde',
  disponible: 'am-badge-verde',
  activo: 'am-badge-verde',
  completada: 'am-badge-azul',
  ocupada: 'am-badge-ambar',
  cancelada: 'am-badge-rojo',
  inactivo: 'am-badge-gris',
  oculta: 'am-badge-gris',
  mantenimiento: 'am-badge-rojo',
};

function StatusBadge({ value }) {
  const clave = String(value).toLowerCase();
  const tono = TONOS[clave] || 'am-badge-gris';
  const label = clave.charAt(0).toUpperCase() + clave.slice(1);
  return <span className={`am-badge ${tono}`}>{label}</span>;
}

export default StatusBadge;
