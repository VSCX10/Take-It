# Take&It — Documentación del proyecto

Plataforma web de reservas gastronómicas para Lima, Perú.  
Universidad de Lima · Ingeniería de Sistemas · Grupo 4 · Docente: Neil Muñoz

---

## Arrancar el proyecto

Abrir **dos terminales** desde la raíz `Take-It/`.

**Backend** (puerto 3000):
```bash
cd backend
npm install
node index.js
```

**Frontend** (puerto 5173 vía Vite):
```bash
cd frontend
npm install
npm run dev
```

**Lint del frontend:**
```bash
cd frontend && npm run lint
```

---

## Variables de entorno

Crear `backend/.env` — **nunca commitear este archivo**.

```env
DATABASE_URL=<neon-postgres-connection-string>
PORT=3000
JWT_SECRET=<clave-secreta>
```

El backend se conecta a Neon PostgreSQL vía SSL. Al arrancar, Sequelize ejecuta `sync({ alter: true })` para auto-migrar el esquema según los modelos.

---

## Arquitectura

### Backend (`backend/`)

Express 5 en CommonJS con arquitectura por capas:

| Capa | Carpeta / archivo | Responsabilidad |
|------|-------------------|-----------------|
| Entry point | `index.js` | Registra Express, CORS, rutas, asociaciones de modelos y arranca Sequelize |
| Base de datos | `database.js` | Instancia Sequelize con SSL vía `DATABASE_URL` |
| Modelos | `models/` | Definiciones Sequelize: `Usuario`, `Restaurante`, `Menu`, `Reserva` |
| Servicios | `services/` | Lógica de negocio: `UsuarioServicio`, `RestauranteServicio`, `ReservaServicio`, `MenuServicio` |
| Rutas | `routes/` | Routers Express: `auth`, `restaurantes`, `menu`, `reservas`, `usuarios` |
| Factories | `factories/` | `ServicioFactory` (instancia servicios por clave) · `ResponseFactory` (respuestas `{ ok, mensaje, data }`) |

**Rutas API actuales:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario — devuelve JWT |
| POST | `/api/auth/login` | Inicio de sesión — devuelve JWT |
| GET | `/api/restaurantes` | Listado de restaurantes |
| POST | `/api/restaurantes` | Crear restaurante |
| GET | `/api/restaurantes/:id/menu` | Menú de un restaurante |
| POST | `/api/reservas` | Crear reserva |
| GET | `/api/reservas/:usuarioId` | Reservas de un usuario (incluye nombre del restaurante vía JOIN) |
| PATCH | `/api/reservas/:id/cancelar` | Cancelar reserva |
| PUT | `/api/usuarios/:id` | Actualizar perfil (nombre, apellido, teléfono) |

**Modelos y campos:**

```
Usuario     → id, nombre, apellido, email, telefono, password
Restaurante → id, nombre, categoria, rating, img, descripcion, direccion
Menu        → id, restauranteId, nombre, descripcion, precio, imagen
Reserva     → id, usuarioId, restauranteId, fecha, hora, personas, estado, total
```

Asociaciones registradas en `index.js`:
- `Reserva.belongsTo(Restaurante, { as: 'restaurante' })`
- `Restaurante.hasMany(Reserva, { as: 'reservas' })`

### Frontend (`frontend/`)

React 19 + Vite 8 (ESM). Tabler Icons cargado vía CDN en `index.html`.

**Contexto global:**
- `AuthContext.jsx` — JWT en localStorage; expone `registrar`, `iniciarSesion`, `cerrarSesion`, `actualizarPerfil`, `usuarioActual`
- `ProtectedRoute.jsx` — `PrivateRoute` (redirige a `/login` sin sesión) · `PublicRoute` (redirige a `/inicio` con sesión)

**Rutas:**

| Path | Componente | Guard |
|------|-----------|-------|
| `/login` | `Login` | PublicRoute |
| `/registro` | `Register` | PublicRoute |
| `/inicio` | `Inicio` | PrivateRoute |
| `/contenido/:id` | `ContenidoRestaurante` | PrivateRoute |
| `/perfil` | `Perfil` | PrivateRoute |
| `/nosotros` | `SobreNosotros` | PrivateRoute |

**Paleta de colores** (variables en `index.css` — usar siempre estas, no valores fijos):

```css
--naranja: #c2440e        --naranja-hover: #a8370b
--naranja-suave: #FFF7ED  --negro: #1a1714
--blanco: #ffffff          --fondo: #faf9f7
--borde: #e8e3da           --borde-input: #e0dbd3
--texto-muted: #9a958e     --placeholder: #b0aba4
```

**Iconos:** usar `<i className="ti ti-nombre" />` (Tabler Icons). No usar emojis en componentes nuevos.

El frontend llama al backend en `http://localhost:3000/api` (hardcodeado en `AuthContext`). JWT se envía como `Authorization: Bearer <token>`.

---

## Convenciones del equipo

- Nunca hacer push directo a `main` — trabajar en ramas individuales por integrante
- Nunca commitear `backend/.env`
- Formato de commit: `[HU-XX] descripción breve del cambio`
- Pull Request obligatorio para integrar cambios, mínimo 1 revisor
- CSS: usar variables de `index.css`, no colores hardcodeados
- Foto de perfil del usuario: guardada en `localStorage` como base64 (`foto_<userId>`), sin backend

---

## Changelog

Tipos: `ADD` nuevo · `CHANGE` modificación · `FIX` corrección · `REMOVE` eliminación.

---

### [Release 1] — Sprint 1 · Junio 2026

**Backend**
- `ADD` Servidor Express 5 con arquitectura por capas y factory pattern
- `ADD` Conexión Neon PostgreSQL vía Sequelize + SSL
- `ADD` Modelos: `Usuario`, `Restaurante`, `Menu`, `Reserva`
- `ADD` Rutas: `POST /auth/register`, `POST /auth/login`, `GET /restaurantes`, `GET /restaurantes/:id/menu`, `POST /reservas`, `GET /reservas/:usuarioId`, `PATCH /reservas/:id/cancelar`

**Frontend**
- `ADD` App React 19 + Vite 8 con React Router v6
- `ADD` `AuthContext` con gestión de sesión JWT en localStorage
- `ADD` Paleta de colores unificada vía CSS custom properties
- `ADD` Tabler Icons vía CDN
- `ADD` Página `/login` y `/registro`
- `ADD` Página `/inicio` — hero carousel, buscador flotante, grid de restaurantes con filtros, sección Promociones con navegación a restaurante
- `ADD` Página `/contenido/:id` — banner, menú con controles de cantidad, sidebar de reserva
- `ADD` Página `/perfil` — datos del usuario y listado de reservas
- `ADD` Página `/nosotros` — presentación del equipo, stack técnico y features del Release 1

---

### [Release 1 — UI Patch] · Junio 2026

Mejoras visuales y funcionales sin modificar la estructura de la base de datos.

**Backend**
- `ADD` Campo `telefono` en la respuesta de login y registro
- `ADD` Método `actualizar(id, datos)` en `UsuarioServicio`
- `ADD` `PUT /api/usuarios/:id` para actualizar perfil
- `ADD` Asociaciones Sequelize entre `Reserva` y `Restaurante`
- `CHANGE` `ReservaServicio.obtenerPorUsuario()` — incluye JOIN con `Restaurante` (nombre e imagen), ordenado por id DESC

**Frontend — `/inicio`**
- `REMOVE` Botón "Registrar Negocio" del navbar (diferido a panel admin en R2)
- `REMOVE` Botón "Ver Disponibilidad" en el cuerpo de cada tarjeta de restaurante — queda solo el overlay al pasar el cursor sobre la imagen

**Frontend — `/contenido/:id`**
- `CHANGE` Sidebar "Tu Reserva" rediseñado: cabecera naranja con nombre del restaurante, campos con iconos Tabler, mini-tarjetas por plato con controles `−/+`, totales sobre fondo negro, botón "Confirmar Reserva" con spinner

**Frontend — `/perfil`**
- `CHANGE` Rediseño completo en dos columnas: foto de perfil editable (subida local → localStorage), datos con modo edición inline, selector de prefijo de país para teléfono, botones separados "Editar datos" / "Cerrar sesión"
- `ADD` Tarjetas de reserva con nombre del restaurante, chips de fecha/hora/personas, monto si hay preorden, y línea de tiempo de estado: Registrado → Pendiente confirmar → Confirmado
- `ADD` `actualizarPerfil(datos)` en `AuthContext` — sincroniza cambios en estado y localStorage sin requerir nuevo login

**Frontend — `/nosotros`**
- `CHANGE` Chip "Release 1 · 2026" → "Release 2 · 2026"
- `CHANGE` Chip "Docente: Neil Muñoz" → "App Web · Full Stack"
- `REMOVE` 4to bloque de estadísticas (HUs R1) — quedan: ODS 9, JWT, Scrum
- `CHANGE` Footer con símbolo © y texto actualizado
- `FIX` Foto de perfil de Rodrigo — URL corregida a imagen de delfín

---

### [Release 2] — Sprint Único · 17 junio – 11 julio 2026

> En desarrollo. Backlog completo en `DOCUMENTACION REALEASE 2 - CODE/Release2_Documentacion.docx`.

| HU | Alias | Prioridad |
|----|-------|-----------|
| HU-05 | Perfil usuario editable | Must Have |
| HU-06 | Cancelación desde historial | Must Have |
| HU-07 | POST /reservas end-to-end | Must Have |
| HU-08 | Navegación dinámica navbar | Must Have |
| HU-09 | Carrusel noticias gastronómicas | Should Have |
| HU-10 | Detalle de restaurante dinámico | Must Have |
| HU-11 | Listado dinámico desde API | Must Have |
| HU-12 | Confirmación de reserva con número | Must Have |
| HU-13 | Hash bcrypt + recuperación por email | Must Have |
| HU-14 | Panel admin (protegido por rol JWT) | Must Have |
| HU-15 | Reseñas post-visita | Should Have |
| HU-16 | Recordatorio por email (Nodemailer + cron) | Should Have |
| HU-17 | Pagos con Culqi (PEN) | Should Have |
| HU-18 | Favoritos de restaurantes | Could Have |
