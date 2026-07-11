import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../Login/Login.css';

const API_URL = '/api/auth';

function Restablecer() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token');

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const confirmarCambio = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch(`${API_URL}/restablecer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const datos = await respuesta.json();

      if (!datos.ok) {
        setError(datos.mensaje);
        setCargando(false);
        return;
      }

      setExito('Contraseña actualizada. Redirigiendo al inicio de sesión...');
      setTimeout(() => navigate('/login'), 1800);
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
      setCargando(false);
    }
  };

  return (
    <div className="login-contenedor">
      <div className="login-branding">
        <h1>Take<span>&amp;</span>It</h1>
        <p>Un último paso para confirmar.</p>
        <div className="beneficios">
          <div className="beneficio-item"><span>1</span> Verificamos tu correo</div>
          <div className="beneficio-item"><span>2</span> Confirma el cambio con un clic</div>
          <div className="beneficio-item"><span>3</span> Inicia sesión con tu nueva contraseña</div>
        </div>
      </div>

      <div className="login-formulario-seccion">
        <div className="formulario-caja">
          <h2>Confirmar cambio</h2>
          <p className="subtitulo-form">
            Estás a punto de cambiar la contraseña de tu cuenta
          </p>

          {error && <div className="alerta-error">{error}</div>}
          {exito && <div className="alerta-exito">{exito}</div>}

          {!token ? (
            <div className="alerta-error">
              El enlace no es válido. Solicita uno nuevo desde "¿Olvidaste tu contraseña?".
            </div>
          ) : (
            !exito && (
              <button className="btn-principal" onClick={confirmarCambio} disabled={cargando}>
                {cargando ? 'Confirmando...' : 'Sí, cambiar mi contraseña'}
              </button>
            )
          )}

          <p className="texto-cambio">
            ¿No solicitaste este cambio?{' '}
            <button type="button" className="btn-texto" onClick={() => navigate('/login')}>
              Ir al inicio de sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Restablecer;
