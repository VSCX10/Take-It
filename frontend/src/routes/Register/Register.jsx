import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const REGLAS_PASSWORD = [
  { test: (p) => p.length >= 8, texto: 'Mínimo 8 caracteres' },
  { test: (p) => /[A-Z]/.test(p), texto: 'Al menos una mayúscula' },
  { test: (p) => /[0-9]/.test(p), texto: 'Al menos un número' },
];

function validar(campos) {
  const errores = {};

  if (!campos.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio.';
  } else if (campos.nombre.trim().length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres.';
  }

  if (!campos.apellido.trim()) {
    errores.apellido = 'El apellido es obligatorio.';
  } else if (campos.apellido.trim().length < 2) {
    errores.apellido = 'El apellido debe tener al menos 2 caracteres.';
  }

  if (!campos.email.trim()) {
    errores.email = 'El correo es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email)) {
    errores.email = 'Ingresa un correo válido.';
  }

  if (campos.telefono && !/^\+?[\d\s\-()]{7,15}$/.test(campos.telefono)) {
    errores.telefono = 'Ingresa un número de teléfono válido.';
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

function Registro() {
  const navigate = useNavigate();
  const { registrar } = useAuth();

  const [campos, setCampos] = useState({
    nombre: '', apellido: '', email: '',
    telefono: '', password: '', confirmar: '',
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
    setErrorGeneral('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = validar(campos);

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setCargando(true);

    
setTimeout(async () => {
  const resultado = await registrar(campos);
  setCargando(false);

  if (!resultado.ok) {
    setErrorGeneral(resultado.mensaje);
    return;
  }

  navigate('/inicio');  
}, 600);
  };

  const fuerzaPassword = REGLAS_PASSWORD.filter((r) => r.test(campos.password)).length;

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
          <h2>Crear Cuenta</h2>
          <p className="subtitulo-form">Únete y optimiza tu tiempo</p>

          {errorGeneral && (
            <div className="alerta-error">{errorGeneral}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="fila-doble">
              <div className={`grupo-input ${errores.nombre ? 'con-error' : ''}`}>
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Juan"
                  value={campos.nombre}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
                {errores.nombre && <span className="msg-error">{errores.nombre}</span>}
              </div>

              <div className={`grupo-input ${errores.apellido ? 'con-error' : ''}`}>
                <label htmlFor="apellido">Apellido</label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  placeholder="Pérez"
                  value={campos.apellido}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
                {errores.apellido && <span className="msg-error">{errores.apellido}</span>}
              </div>
            </div>

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

            <div className={`grupo-input ${errores.telefono ? 'con-error' : ''}`}>
              <label htmlFor="telefono">
                Teléfono <span className="etiqueta-opcional">(opcional)</span>
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="999 999 999"
                value={campos.telefono}
                onChange={handleChange}
                autoComplete="tel"
              />
              {errores.telefono && <span className="msg-error">{errores.telefono}</span>}
            </div>

            <div className={`grupo-input ${errores.password ? 'con-error' : ''}`}>
              <label htmlFor="password">Contraseña</label>
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
              {errores.password && <span className="msg-error">{errores.password}</span>}
            </div>

            <div className={`grupo-input ${errores.confirmar ? 'con-error' : ''}`}>
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
              {errores.confirmar && <span className="msg-error">{errores.confirmar}</span>}
            </div>

            <button type="submit" className="btn-principal" disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <p className="texto-cambio">
            ¿Ya tienes cuenta?{' '}
            <button type="button" className="btn-texto" onClick={() => navigate('/login')}>
              Inicia Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registro;
