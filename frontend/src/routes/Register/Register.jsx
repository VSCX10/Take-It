import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Register.css'; 

function Registro() {
    const navigate = useNavigate(); 

    const manejarEnvio = (e) => {
    e.preventDefault(); 
    alert("¡Cuenta creada con éxito! (Modo de prueba)");
    navigate('/login'); 
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
          <h2>Crear Cuenta</h2>
          <p className="subtitulo-form">Únete y optimiza tu tiempo</p>

          <form onSubmit={manejarEnvio}>
            <div className="grupo-input">
              <label>Correo electrónico:</label>
              <input type="email" placeholder="tucorreo@ejemplo.com" required />
            </div>
            
            <div className="grupo-input">
              <label>Crear contraseña:</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            <div className="grupo-input">
              <label>Confirmar contraseña:</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            <button type="submit" className="btn-principal">
              Registrarse
            </button>
          </form>

          <p className="texto-cambio">
            ¿Ya tienes cuenta? 
            
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