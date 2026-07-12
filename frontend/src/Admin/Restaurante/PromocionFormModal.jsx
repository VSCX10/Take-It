import { useState, useRef } from 'react';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import AlertBanner from '../components/AlertBanner';

const MAX_LADO = 640;

function PromocionFormModal({ promocion, onGuardar, onClose }) {
  const editando = Boolean(promocion);
  const [form, setForm] = useState({
    titulo: promocion?.titulo || '',
    descripcion: promocion?.descripcion || '',
    imagen: promocion?.imagen || '',
    fechaInicio: promocion?.fechaInicio || '',
    fechaFin: promocion?.fechaFin || '',
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const inputImagenRef = useRef(null);

  const campo = (name) => (e) => setForm((p) => ({ ...p, [name]: e.target.value }));

  // Reduce la imagen a maximo 640px de lado (mismo patron que la foto de perfil)
  const elegirImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const escala = Math.min(1, MAX_LADO / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = img.width * escala;
        canvas.height = img.height * escala;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        setForm((p) => ({ ...p, imagen: canvas.toDataURL('image/jpeg', 0.85) }));
      };
      img.src = ev.target.result;
    };
    lector.readAsDataURL(archivo);
  };

  const guardar = async () => {
    if (!form.titulo || !form.fechaInicio || !form.fechaFin) {
      setError('Título y fechas son obligatorios');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await onGuardar(form);
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal
      titulo={editando ? 'Editar promoción' : 'Nueva promoción'}
      onClose={onClose}
      ancho="560px"
      footer={
        <>
          <button className="am-btn am-btn-secundario" onClick={onClose} disabled={guardando}>Cancelar</button>
          <button className="am-btn am-btn-primario" onClick={guardar} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </>
      }
    >
      <AlertBanner tipo="error">{error}</AlertBanner>

      <div className="am-campo">
        <label>Imagen</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {form.imagen && (
            <img src={form.imagen} alt="" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
          )}
          <button type="button" className="am-btn am-btn-secundario" onClick={() => inputImagenRef.current?.click()}>
            <i className="ti ti-upload" /> {form.imagen ? 'Cambiar imagen' : 'Subir imagen'}
          </button>
          <input ref={inputImagenRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={elegirImagen} />
        </div>
      </div>

      <FormField label="Título" name="titulo" value={form.titulo} onChange={campo('titulo')} required />
      <FormField label="Descripción" name="descripcion" type="textarea" value={form.descripcion} onChange={campo('descripcion')} />

      <div className="am-form-grid">
        <FormField label="Fecha inicio" name="fechaInicio" type="date" value={form.fechaInicio} onChange={campo('fechaInicio')} required />
        <FormField label="Fecha fin" name="fechaFin" type="date" value={form.fechaFin} onChange={campo('fechaFin')} required />
      </div>
    </Modal>
  );
}

export default PromocionFormModal;
