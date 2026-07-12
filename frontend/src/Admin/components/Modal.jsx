import './components.css';

function Modal({ titulo, onClose, children, footer, ancho }) {
  return (
    <div className="am-modal-overlay" onClick={onClose}>
      <div
        className="am-modal"
        style={ancho ? { maxWidth: ancho } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="am-modal-header">
          <h3>{titulo}</h3>
          <button className="am-modal-cerrar" onClick={onClose} aria-label="Cerrar">
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="am-modal-body">{children}</div>
        {footer && <div className="am-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
