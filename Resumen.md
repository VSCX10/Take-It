# Take&It — Resumen del proyecto

Plataforma web de reservas gastronómicas para Lima, Perú.
Universidad de Lima · Ingeniería de Sistemas · Grupo 4 · Docente: Neil Muñoz

App desplegada: https://take-it-omega.vercel.app (cada push a `main` redeploya solo)

---

## Arrancar el proyecto

Abrir dos terminales desde la raíz `Take-It/`.

**Backend** (puerto 3000):
```bash
cd backend && npm install && node index.js
```

**Frontend** (puerto 5173):
```bash
cd frontend && npm install && npm run dev
```

**Pruebas del backend (Jest):** `cd backend && npm test`
**Métricas de complejidad ciclomática:** `cd backend && npm run metricas`
**Lint del frontend:** `cd frontend && npm run lint`

## Variables de entorno

Crear `backend/.env` — nunca commitear este archivo. En producción van en el dashboard de Vercel.

```env
DATABASE_URL=<neon-postgres-connection-string>
PORT=3000
JWT_SECRET=<clave-secreta>
EMAIL_USER=<gmail-del-equipo>          # para el correo de recuperación
EMAIL_PASS=<app-password-de-gmail>     # sin esto, el código sale por consola
```

Al arrancar local, Sequelize ejecuta `sync({ alter: true })` para migrar el esquema y corren los seeders (`seedMesas`, `seedAdminGeneral`).

---

## Arquitectura

### Backend (`backend/`) — Express 5 por capas

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Entry point | `index.js` | Express, CORS, rutas, asociaciones y arranque |
| Base de datos | `database.js` | Sequelize + Neon PostgreSQL vía SSL |
| Modelos | `models/` | `Usuario`, `Restaurante`, `Menu`, `Reserva`, `Favorito`, `Mesa` |
| Servicios | `services/` | Lógica de negocio (uno por modelo + `DashboardServicio`, `CorreoServicio`) |
| Rutas | `routes/` | `auth`, `restaurantes`, `menu`, `reservas`, `usuarios`, `favoritos`, `panel/general` |
| Factories | `factories/` | `ServicioFactory` · `ResponseFactory` (`{ ok, mensaje, data }`) |
| Middleware | `middleware/` | `verificarToken` (JWT) · `verificarRol` (admin) |
| Pruebas | `tests/` | Caja blanca, caja negra y unitarias |

### Rutas API (🔒 = JWT · 👑 = solo admin)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro — devuelve JWT |
| POST | `/api/auth/login` | Login — devuelve JWT |
| POST | `/api/auth/recuperar` | Envía código de 6 dígitos al correo (vence en 3 min, un solo uso) |
| POST | `/api/auth/restablecer` | Aplica el cambio de contraseña verificando el código |
| GET | `/api/restaurantes` | Catálogo de restaurantes activos |
| GET | `/api/restaurantes/promociones` | Platos con descuento agrupados por restaurante |
| GET | `/api/restaurantes/:id/disponibilidad` | Bloques de hora con mesas libres (`?fecha=&personas=`) |
| GET | `/api/restaurantes/:id/menu` | Menú de un restaurante |
| POST 🔒 | `/api/reservas` | Crear reserva (sin preorden se confirma sola; con platos queda pendiente del admin; 409 si duplicada o sin mesas) |
| GET 🔒 | `/api/reservas/:usuarioId` | Reservas del usuario |
| PATCH 🔒 | `/api/reservas/:id/cancelar` | Cancelar reserva |
| PUT 🔒 | `/api/usuarios/:id` | Actualizar perfil |
| PUT 🔒 | `/api/usuarios/:id/foto` | Guardar foto de perfil (base64) |
| GET 🔒 | `/api/favoritos/:usuarioId` | Favoritos del usuario |
| POST 🔒 | `/api/favoritos` | Marcar favorito |
| DELETE 🔒 | `/api/favoritos/:usuarioId/:restauranteId` | Quitar favorito |
| GET 🔒👑 | `/api/panel/general/dashboard` | Métricas de la plataforma |
| GET 🔒👑 | `/api/panel/general/reservas` | Todas las reservas (`?fecha=&estado=&cliente=`) |
| PATCH 🔒👑 | `/api/panel/general/reservas/:id/confirmar` \| `/completar` \| `/cancelar` | Cambiar estado |
| GET/POST 🔒👑 | `/api/panel/general/restaurantes` | Listar+buscar / crear |
| PUT/PATCH/DELETE 🔒👑 | `/api/panel/general/restaurantes/:id` | Editar / activar-desactivar / eliminar |

### Modelos

```
Usuario     → id, nombre, apellido, email, telefono, password, rol, foto,
              codigoRecuperacion, passwordPendiente, recuperacionExpira
Restaurante → id, nombre, categoria, rating, img, descripcion, direccion,
              horaApertura, horaCierre, activo
Menu        → id, restauranteId, nombre, descripcion, precio, imagen, descuentoPct, stock
Reserva     → id, usuarioId, restauranteId, mesaId, fecha, hora, personas, estado, total, metodoPago
Favorito    → id, usuarioId, restauranteId (par único)
Mesa        → id, restauranteId, capacidad, codigo
```

- `Usuario.rol`: `'cliente'` | `'admin_general'`
- `Reserva.estado`: `pendiente` | `confirmada` | `cancelada` | `completada`
- `Menu.stock`: `null` = sin límite, `0` = agotado · `descuentoPct` alimenta las promociones del inicio
- Contraseñas con hash bcrypt (hook del modelo)

### Reglas de negocio clave

- **Reserva sin platos** → se confirma sola. **Con preorden** (`total > 0`) → queda `pendiente` y el admin la aprueba o rechaza desde el panel.
- Un usuario **no puede repetir** una reserva activa en el mismo restaurante, fecha y hora (409).
- La disponibilidad se calcula por **mesas**: bloques de 30 min entre `horaApertura` y `horaCierre`; se asigna la mesa libre más pequeña que acomode al grupo.
- **Recuperar contraseña**: se define la clave nueva en el formulario, llega un código de 6 dígitos al correo (sin enlaces, evita spam) y el cambio se aplica al confirmarlo.

### Frontend (`frontend/`) — React 19 + Vite 8

| Path | Componente | Guard |
|------|-----------|-------|
| `/login`, `/registro`, `/recuperar` | Auth | PublicRoute |
| `/inicio` | Inicio (catálogo, promos, favoritos) | PrivateRoute |
| `/contenido/:id` | Restaurante (menú, reserva por mesas) | PrivateRoute |
| `/perfil` | Perfil (datos, foto, reservas) | PrivateRoute |
| `/favoritos` | Favoritos | PrivateRoute |
| `/nosotros` | Sobre Nosotros | PrivateRoute |
| `/panel/general/{dashboard,restaurantes,reservas}` | Panel admin | AdminRoute (`admin_general`) |

- `AuthContext` guarda el JWT en localStorage y lo envía como `Authorization: Bearer` (helper `utils/authHeaders.js`)
- El frontend llama a `/api` relativo (proxy de Vite en dev, mismo dominio en Vercel)
- Panel admin en `frontend/src/Admin/` (layout con sidebar + componentes reusables)

**Paleta** (variables en `index.css` — usar siempre estas):
```css
--naranja: #c2440e   --naranja-hover: #a8370b   --negro: #1a1714
--blanco: #ffffff    --fondo: #faf9f7           --borde: #e8e3da
```
Iconos con Tabler (`<i className="ti ti-nombre" />`).

### Administrador

Cuenta única: `admin@takeit.com` / `Admin123` (rol `admin_general`, la asegura `seedAdminGeneral` al arrancar local). El panel permite gestionar restaurantes y ver/confirmar/completar/cancelar todas las reservas.

---

## Pruebas (Jest, `backend/tests/`)

- **Caja blanca**: `MesaServicio.disponibilidad` (complejidad ciclomática 5, mayor a 4) con los modelos simulados.
- **Caja negra**: `POST /api/auth/register` (6 campos de entrada) con clases de equivalencia y valores límite.
- **Unitarias**: `MesaServicio.generarSlots` con 4 casos.

`npm run metricas` lista las funciones con complejidad mayor a 4 (evidencia para el informe).

## Convenciones del equipo

- Nunca hacer push directo a `main` — ramas individuales por integrante y PR con mínimo 1 revisor
- Nunca commitear `backend/.env`
- Commits: descripción breve del cambio en español
- CSS: usar variables de `index.css`, no colores hardcodeados
