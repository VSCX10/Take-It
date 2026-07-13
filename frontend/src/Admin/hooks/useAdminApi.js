import { authHeaders } from '../../utils/authHeaders';

async function llamar(ruta, opciones = {}) {
  const headers = { ...authHeaders(), ...(opciones.headers || {}) };
  if (opciones.body && !(opciones.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const resp = await fetch(`/api/panel${ruta}`, { ...opciones, headers });
  const datos = await resp.json();
  if (!datos.ok) throw new Error(datos.mensaje || 'Error de servidor');
  return datos.data;
}

export function useAdminApi() {
  return {
    get: (ruta) => llamar(ruta),
    post: (ruta, body) => llamar(ruta, { method: 'POST', body: JSON.stringify(body) }),
    put: (ruta, body) => llamar(ruta, { method: 'PUT', body: JSON.stringify(body) }),
    patch: (ruta, body) => llamar(ruta, { method: 'PATCH', body: JSON.stringify(body || {}) }),
    del: (ruta) => llamar(ruta, { method: 'DELETE' }),
  };
}
