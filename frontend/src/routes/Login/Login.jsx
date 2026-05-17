import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css'; // Usamos el mismo CSS

function Login() {
  const navigate = useNavigate(); 

  const manejarEnvio = (e) => {
    e.preventDefault(); 
    alert("¡Sesión iniciada con éxito! (Modo de prueba)");
    navigate('/'); 
  };

  return (
    <div className="login-contenedor">
      <div className="login-branding">
        <h1>Take<span>&</span>It</h1>
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

          <form onSubmit={manejarEnvio}>
            <div className="grupo-input">
              <label>Correo electrónico:</label>
              <input type="email" placeholder="tucorreo@ejemplo.com" required />
            </div>
            
            <div className="grupo-input">
              <label>Contraseña:</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            <a href="#" className="link-olvido">¿Olvidaste tu contraseña?</a>

            <button type="submit" className="btn-principal">
              Iniciar Sesión
            </button>
          </form>

          <p className="texto-cambio">
            ¿No tienes cuenta? 
            {/* Este botón ahora viaja a la otra pantalla */}
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