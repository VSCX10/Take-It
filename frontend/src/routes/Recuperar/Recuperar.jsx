import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.css';

const API_URL = '/api/auth';

function Recuperar() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('El correo es obligatorio.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un correo válido.');
      return;
    }

    setCargando(true);
    setError('');
    try {
      const respuesta = await fetch(`${API_URL}/recuperar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const datos = await respuesta.json();

      if (!datos.ok) {
        setError(datos.mensaje);
      } else {
        setExito('Te enviamos un enlace a tu correo. Revísalo para confirmar el cambio de contraseña.');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-contenedor">
      <div className="login-branding">
        <h1>Take<span>&amp;</span>It</h1>
        <p>Recupera el acceso a tu cuenta.</p>
        <div className="beneficios">
          <div className="beneficio-item"><span>1</span> Ingresa el correo de tu cuenta</div>
          <div className="beneficio-item"><span>2</span> Abre el enlace que te enviamos</div>
          <div className="beneficio-item"><span>3</span> Crea tu nueva contraseña</div>
        </div>
      </div>

      <div className="login-formulario-seccion">
        <div className="formulario-caja">
          <h2>Recuperar contraseña</h2>
          <p className="subtitulo-form">Te enviaremos un enlace de confirmación a tu correo</p>

          {error && <div className="alerta-error">{error}</div>}
          {exito && <div className="alerta-exito">{exito}</div>}

          {!exito && (
            <form onSubmit={handleSubmit} noValidate>
              <div className={`grupo-input ${error ? 'con-error' : ''}`}>
                <label htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                />
              </div>

              <button type="submit" className="btn-principal" disabled={cargando}>
                {cargando ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>
          )}

          <p className="texto-cambio">
            ¿Recordaste tu contraseña?{' '}
            <button type="button" className="btn-texto" onClick={() => navigate('/login')}>
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Recuperar;
