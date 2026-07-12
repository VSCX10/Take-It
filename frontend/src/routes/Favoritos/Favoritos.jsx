import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authHeaders } from '../../utils/authHeaders';
import './Favoritos.css';

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [quitando, setQuitando] = useState(null);
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuarioActual) return;
    fetch(`/api/favoritos/${usuarioActual.id}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((datos) => { setFavoritos(datos.data || []); setCargando(false); })
      .catch(() => setCargando(false));
  }, [usuarioActual]);

  const quitarFavorito = (restauranteId) => {
    setQuitando(restauranteId);
    fetch(`/api/favoritos/${usuarioActual.id}/${restauranteId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
      .then(() => setFavoritos((prev) => prev.filter((f) => f.restauranteId !== restauranteId)))
      .finally(() => setQuitando(null));
  };

  return (
    <div className="fv-pagina">
      <header className="fv-header">
        <button className="fv-volver" onClick={() => navigate('/inicio')}>
          <i className="ti ti-arrow-left" /> Volver
        </button>
        <span className="fv-header-titulo">Mis Favoritos</span>
        <span className="fv-header-spacer" />
      </header>

      <div className="fv-cuerpo">
        <div className="fv-cabecera">
          <h2 className="fv-titulo">Restaurantes favoritos</h2>
          <span className="fv-total">
            {favoritos.length} restaurante{favoritos.length !== 1 ? 's' : ''}
          </span>
        </div>

        {cargando ? (
          <div className="fv-estado-msg">Cargando favoritos...</div>
        ) : favoritos.length === 0 ? (
          <div className="fv-sin-favoritos">
            <i className="ti ti-heart-off" />
            <p>Aún no tienes restaurantes favoritos</p>
            <button onClick={() => navigate('/inicio')}>
              <i className="ti ti-search" /> Explorar restaurantes
            </button>
          </div>
        ) : (
          <div className="fv-grid">
            {favoritos.map((fav) => {
              const rest = fav.restaurante;
              if (!rest) return null;
              return (
                <div
                  key={fav.id}
                  className="fv-tarjeta"
                  onClick={() => navigate(`/contenido/${rest.id}`)}
                >
                  <div className="fv-tarjeta-img">
                    <img src={rest.img} alt={rest.nombre} />
                    <button
                      className="fv-btn-quitar"
                      onClick={(e) => { e.stopPropagation(); quitarFavorito(rest.id); }}
                      disabled={quitando === rest.id}
                      aria-label="Quitar de favoritos"
                      title="Quitar de favoritos"
                    >
                      <i className="ti ti-heart" />
                    </button>
                    <span className="fv-badge-rating">⭐ {rest.rating}</span>
                  </div>
                  <div className="fv-tarjeta-body">
                    <span className="fv-tarjeta-pill">{rest.categoria}</span>
                    <h3 className="fv-tarjeta-nombre">{rest.nombre}</h3>
                    {rest.direccion && (
                      <p className="fv-tarjeta-direccion">
                        <i className="ti ti-map-pin" /> {rest.direccion}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoritos;
