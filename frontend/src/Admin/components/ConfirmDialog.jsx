import Modal from './Modal';

function ConfirmDialog({ titulo = 'Confirmar', mensaje, confirmarTexto = 'Eliminar', peligro = true, cargando, onConfirmar, onCancelar }) {
  return (
    <Modal titulo={titulo} onClose={onCancelar} ancho="420px">
      <p className="am-confirm-mensaje">{mensaje}</p>
      <div className="am-confirm-acciones">
        <button className="am-btn am-btn-secundario" onClick={onCancelar} disabled={cargando}>
          Cancelar
        </button>
        <button
          className={`am-btn ${peligro ? 'am-btn-peligro' : 'am-btn-primario'}`}
          onClick={onConfirmar}
          disabled={cargando}
        >
          {cargando ? 'Procesando...' : confirmarTexto}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
