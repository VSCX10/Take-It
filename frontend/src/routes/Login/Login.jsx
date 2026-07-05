import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

function validar(campos) {
  const errores = {};

  if (!campos.email.trim()) {
    errores.email = 'El correo es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email)) {
    errores.email = 'Ingresa un correo válido.';
  }

  if (!campos.password) {
    errores.password = 'La contraseña es obligatoria.';
  } else if (campos.password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  return errores;
}

function Login() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  const [campos, setCampos] = useState({ email: '', password: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [intentos, setIntentos] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }));
    setErrorGeneral('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (intentos >= 5) {
      setErrorGeneral('Demasiados intentos fallidos. Espera un momento e intenta de nuevo.');
      return;
    }

    const nuevosErrores = validar(campos);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setCargando(true);
setTimeout(async () => {
  const resultado = await iniciarSesion(campos.email, campos.password);
  setCargando(false);

  if (!resultado.ok) {
    setIntentos((v) => v + 1);
    setErrorGeneral(resultado.mensaje);
    return;
  }

  navigate('/inicio');
}, 500);
  };

  return (
    <div className="login-contenedor">
      <div className="login-branding">
        <h1>Take<span>&amp;</span>It</h1>
        <p>Todas tus reservas en una sola App.</p>
        <div className="beneficios">
          <div className="beneficio-item"><span>1</span> Encuentra tu restaurante favorito</div>
          <div className="beneficio-item"><span>2</span> Reserva tu mesa en segundos</div>
          <div className="beneficio-item"><span>3</span> Pre-ordena y no esperes más</div>
        </div>
      </div>

      <div className="login-formulario-seccion">
        <div className="formulario-caja">
          <h2>Iniciar Sesión</h2>
          <p className="subtitulo-form">Bienvenido de vuelta a Take&It</p>

          {errorGeneral && (
            <div className="alerta-error">{errorGeneral}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className={`grupo-input ${errores.email ? 'con-error' : ''}`}>
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={campos.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errores.email && <span className="msg-error">{errores.email}</span>}
            </div>

            <div className={`grupo-input ${errores.password ? 'con-error' : ''}`}>
              <label htmlFor="password">Contraseña</label>
              <div className="input-con-icono">
                <input
                  id="password"
                  name="password"
                  type={mostrarPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={campos.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="btn-ver-password"
                  onClick={() => setMostrarPassword((v) => !v)}
                  aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <i className={`ti ${mostrarPassword ? 'ti-eye-off' : 'ti-eye'}`} />
                </button>
              </div>
              {errores.password && <span className="msg-error">{errores.password}</span>}
            </div>

            <button type="button" className="link-olvido" onClick={() => navigate('/recuperar')}>
              ¿Olvidaste tu contraseña?
            </button>

            <button type="submit" className="btn-principal" disabled={cargando || intentos >= 5}>
              {cargando ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="texto-cambio">
            ¿No tienes cuenta?{' '}
            <button type="button" className="btn-texto" onClick={() => navigate('/registro')}>
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
