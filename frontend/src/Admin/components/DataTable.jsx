import './components.css';

// Tabla generica y responsiva: columns=[{key,label,render?}], data=[], actions?=(row)=>node
function DataTable({ columns, data, loading, emptyText = 'Sin resultados', actions }) {
  if (loading) {
    return <div className="am-tabla-estado">Cargando...</div>;
  }
  if (!data || data.length === 0) {
    return <div className="am-tabla-estado">{emptyText}</div>;
  }

  return (
    <div className="am-tabla-wrap">
      <table className="am-tabla">
        <thead>
          <tr>
            {columns.map((c) => <th key={c.key}>{c.label}</th>)}
            {actions && <th className="am-tabla-th-acciones">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((c) => (
                <td key={c.key} data-label={c.label}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
              {actions && <td className="am-tabla-acciones" data-label="Acciones">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
