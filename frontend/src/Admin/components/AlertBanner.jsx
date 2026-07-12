import './components.css';

function AlertBanner({ tipo = 'error', children }) {
  if (!children) return null;
  return <div className={`am-alerta am-alerta-${tipo}`}>{children}</div>;
}

export default AlertBanner;
