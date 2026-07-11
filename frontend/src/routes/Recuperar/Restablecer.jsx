import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../Login/Login.css';

const API_URL = '/api/auth';

const REGLAS_PASSWORD = [
  { test: (p) => p.length >= 8, texto: 'Mínimo 8 caracteres' },
  { test: (p) => /[A-Z]/.test(p), texto: 'Al menos una mayúscula' },
  { test: (p) => /[0-9]/.test(p), texto: 'Al menos un número' },
];

function Restablecer() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token');

  const [campos, setCampos] = useState({ password: '', confirmar: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (REGLAS_PASSWORD.some((r) => !r.test(campos.password))) {
      setError('La contraseña no cumple los requisitos.');
      return;
    }
    if (campos.password !== campos.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch(`${API_URL}/restablecer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...campos }),
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

  const fuerzaPassword = REGLAS_PASSWORD.filter((r) => r.test(campos.password)).length;

  return (
    <div className="login-contenedor">
      <div className="login-branding">
        <h1>Take<span>&amp;</span>It</h1>
        <p>Un último paso para volver a entrar.</p>
        <div className="beneficios">
          <div className="beneficio-item"><span>1</span> Verificamos tu correo</div>
          <div className="beneficio-item"><span>2</span> Define tu nueva contraseña</div>
          <div className="beneficio-item"><span>3</span> Inicia sesión al instante</div>
        </div>
      </div>

      <div className="login-formulario-seccion">
        <div className="formulario-caja">
          <h2>Nueva contraseña</h2>
          <p className="subtitulo-form">Confirma el cambio de tu contraseña</p>

          {error && <div className="alerta-error">{error}</div>}
          {exito && <div className="alerta-exito">{exito}</div>}

          {!token ? (
            <div className="alerta-error">
              El enlace no es válido. Solicita uno nuevo desde "¿Olvidaste tu contraseña?".
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="grupo-input">
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
                    {mostrarPassword ? '🙈' : '👁️'}
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
                          {r.test(campos.password) ? '✓' : '○'} {r.texto}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="grupo-input">
                <label htmlFor="confirmar">Confirmar contraseña</label>
                <input
                  id="confirmar"
                  name="confirmar"
                  type={mostrarPassword ? 'text' : 'password'}
                  placeholder="***********"
                  value={campos.confirmar}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="btn-principal" disabled={cargando}>
                {cargando ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Restablecer;
