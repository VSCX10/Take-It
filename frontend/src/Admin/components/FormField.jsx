import './components.css';

function FormField({ label, name, value, onChange, type = 'text', options, error, placeholder, required, rows }) {
  const claseInput = `am-input${error ? ' am-input-error' : ''}`;

  return (
    <div className="am-campo">
      {label && <label htmlFor={name}>{label}{required && <span className="am-req"> *</span>}</label>}

      {type === 'select' ? (
        <select id={name} name={name} value={value} onChange={onChange} className={claseInput}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={name} name={name} value={value} onChange={onChange}
          placeholder={placeholder} rows={rows || 3} className={claseInput}
        />
      ) : (
        <input
          id={name} name={name} type={type} value={value} onChange={onChange}
          placeholder={placeholder} className={claseInput}
        />
      )}

      {error && <span className="am-error-msg">{error}</span>}
    </div>
  );
}

export default FormField;
