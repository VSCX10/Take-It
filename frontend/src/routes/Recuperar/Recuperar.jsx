import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.css';

const API_URL = '/api/auth';

const REGLAS_PASSWORD = [
  { test: (p) => p.length >= 8, texto: 'Mínimo 8 caracteres' },
  { test: (p) => /[A-Z]/.test(p), texto: 'Al menos una mayúscula' },
  { test: (p) => /[0-9]/.test(p), texto: 'Al menos un número' },
];

function validar(campos) {
  const errores = {};

  if (!campos.email.trim()) {
    errores.email = 'El correo es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email)) {
    errores.email = 'Ingresa un correo válido.';
  }

  if (!campos.password) {
    errores.password = 'La contraseña es obligatoria.';
  } else if (REGLAS_PASSWORD.some((r) => !r.test(campos.password))) {
    errores.password = 'La contraseña no cumple los requisitos.';
  }

  if (!campos.confirmar) {
    errores.confirmar = 'Confirma tu contraseña.';
  } else if (campos.password !== campos.confirmar) {
    errores.confirmar = 'Las contraseñas no coinciden.';
  }

  return errores;
}

function Recuperar() {
  const navigate = useNavigate();

  const [campos, setCampos] = useState({ email: '', password: '', confirmar: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [exito, setExito] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }));
    setErrorGeneral('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validar(campos);

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch(`${API_URL}/recuperar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campos),
      });
      const datos = await respuesta.json();

      if (!datos.ok) {
        setErrorGeneral(datos.mensaje);
        setCargando(false);
        return;
      }

      setExito('Contraseña actualizada. Redirigiendo al inicio de sesión...');
      setTimeout(() => navigate('/login'), 1800);
    } catch {
      setErrorGeneral('Error de conexión. Intenta de nuevo.');
      setCargando(false);
    }
  };

  const fuerzaPassword = REGLAS_PASSWORD.filter((r) => r.test(campos.password)).length;

  return (
    <div className="login-contenedor">
      <div className="login-branding">
        <h1>Take<span>&amp;</span>It</h1>
        <p>Recupera el acceso a tu cuenta.</p>
        <div className="beneficios">
          <div className="beneficio-item"><span>1</span> Ingresa el correo de tu cuenta</div>
          <div className="beneficio-item"><span>2</span> Define una nueva contraseña</div>
          <div className="beneficio-item"><span>3</span> Vuelve a entrar al instante</div>
        </div>
      </div>

      <div className="login-formulario-seccion">
        <div className="formulario-caja">
          <h2>Recuperar contraseña</h2>
          <p className="subtitulo-form">Define una nueva contraseña para tu cuenta</p>

          {errorGeneral && <div className="alerta-error">{errorGeneral}</div>}
          {exito && <div className="alerta-exito">{exito}</div>}

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
              <label htmlFor="password">Nueva contraseña</label>
              <div className="input-con-icono">
                <input
                  id="password"
                  name="password"
                  type={mostrarPassword ? 'text' : 'password'}
                  placeholder="***********"
                  value={campos.password}
                  onChange={handleChange}
                  autoComplete="new-password"
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

              {campos.password && (
                <div className="indicador-fuerza">
                  <div className="barras-fuerza">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className={`barra ${fuerzaPassword >= n ? `nivel-${fuerzaPassword}` : ''}`}
                      />
                    ))}
                  </div>
                  <ul className="reglas-password">
                    {REGLAS_PASSWORD.map((r) => (
                      <li key={r.texto} className={r.test(campos.password) ? 'cumplida' : ''}>
                        <i className={`ti ${r.test(campos.password) ? 'ti-circle-check' : 'ti-circle'}`} /> {r.texto}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {errores.password && <span className="msg-error">{errores.password}</span>}
            </div>

            <div className={`grupo-input ${errores.confirmar ? 'con-error' : ''}`}>
              <label htmlFor="confirmar">Confirmar nueva contraseña</label>
              <input
                id="confirmar"
                name="confirmar"
                type={mostrarPassword ? 'text' : 'password'}
                placeholder="***********"
                value={campos.confirmar}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errores.confirmar && <span className="msg-error">{errores.confirmar}</span>}
            </div>

            <button type="submit" className="btn-principal" disabled={cargando}>
              {cargando ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>

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
