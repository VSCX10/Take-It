import './components.css';

function StatCard({ icono, etiqueta, valor }) {
  return (
    <div className="am-stat-card">
      <div className="am-stat-icono"><i className={`ti ${icono}`} /></div>
      <div className="am-stat-textos">
        <span className="am-stat-valor">{valor}</span>
        <span className="am-stat-etiqueta">{etiqueta}</span>
      </div>
    </div>
  );
}

export default StatCard;
