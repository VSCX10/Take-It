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

**Pruebas del backend (Jest — caja blanca, caja negra y unitarias):**
```bash
cd backend && npm test
```

**Métricas de complejidad ciclomática del backend:**
```bash
cd backend && npm run metricas
```

---

## Variables de entorno

Crear `backend/.env` — **nunca commitear este archivo**.

```env
DATABASE_URL=<neon-postgres-connection-string>
PORT=3000
JWT_SECRET=<clave-secreta>
EMAIL_USER=<gmail-del-equipo>          # opcional: para el correo de recuperación
EMAIL_PASS=<app-password-de-gmail>     # opcional: sin esto, el enlace sale por consola
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
| Modelos | `models/` | Definiciones Sequelize: `Usuario`, `Restaurante`, `Menu`, `Reserva`, `Favorito`, `Mesa`, `Promocion`, `Resena` |
| Servicios | `services/` | Lógica de negocio: `UsuarioServicio`, `RestauranteServicio`, `ReservaServicio`, `MenuServicio`, `FavoritoServicio`, `MesaServicio`, `PromocionServicio`, `ResenaServicio`, `DashboardServicio`, `AdminGeneralServicio` |
| Rutas | `routes/` | Routers Express: `auth`, `restaurantes`, `menu`, `reservas`, `usuarios`, `favoritos`, `admin` (legado), `panel/general`, `panel/restaurante` |
| Factories | `factories/` | `ServicioFactory` (instancia servicios por clave) · `ResponseFactory` (respuestas `{ ok, mensaje, data }`) |
| Middleware | `middleware/` | `verificarToken` — valida el JWT (`Authorization: Bearer`) · `verificarAdmin` — solo rol `'admin'` (panel legado) · `verificarRol(...roles)` — RBAC del panel de administración nuevo |
| Pruebas | `tests/` | Jest: caja blanca (`MesaServicio`), caja negra (registro) y unitarias (`generarSlots`, `verificarToken`) |

**Rutas API actuales** (🔒 = requiere JWT · 👑 = solo rol admin):

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario — devuelve JWT |
| POST | `/api/auth/login` | Inicio de sesión — devuelve JWT |
| POST | `/api/auth/recuperar` | Envía al correo un código de 6 dígitos (vence en 3 min, un solo uso) |
| POST | `/api/auth/restablecer` | Aplica el cambio de contraseña verificando el código |
| GET | `/api/restaurantes` | Listado de restaurantes |
| GET | `/api/restaurantes/promociones` | Platos con descuento agrupados por restaurante |
| GET | `/api/restaurantes/:id/disponibilidad` | Bloques de hora con mesas libres (`?fecha=&personas=`) |
| GET | `/api/restaurantes/:id/menu` | Menú de un restaurante |
| POST 🔒 | `/api/reservas` | Crear reserva (sin preorden se confirma sola; con platos queda pendiente del admin) |
| GET 🔒 | `/api/reservas/:usuarioId` | Reservas de un usuario (incluye nombre del restaurante vía JOIN) |
| PATCH 🔒 | `/api/reservas/:id/cancelar` | Cancelar reserva |
| PUT 🔒 | `/api/usuarios/:id` | Actualizar perfil (nombre, apellido, teléfono) |
| GET 🔒 | `/api/favoritos/:usuarioId` | Restaurantes favoritos de un usuario (incluye datos del restaurante vía JOIN) |
| POST 🔒 | `/api/favoritos` | Marcar un restaurante como favorito (`usuarioId`, `restauranteId`) |
| DELETE 🔒 | `/api/favoritos/:usuarioId/:restauranteId` | Quitar un restaurante de favoritos |
| GET 🔒👑 | `/api/admin/reservas` | Reservas con preorden pendientes de aprobación |
| PATCH 🔒👑 | `/api/admin/reservas/:id/confirmar` | Aprobar una reserva pendiente |
| PATCH 🔒👑 | `/api/admin/reservas/:id/rechazar` | Rechazar una reserva pendiente |

**Panel de administración** (`/api/panel/...` — RBAC vía `verificarRol`, independiente del panel legado de arriba):

*`/api/panel/general` — solo rol `admin_general`:*

| Verbo | Ruta | Acción |
|---|---|---|
| GET | `/dashboard` | KPIs: restaurantes, admins, reservas (total y del día), activos, promos activas, reseñas recientes |
| GET/POST | `/restaurantes` | Listar+buscar (`?q=`) / crear restaurante **junto con** su administrador (transacción) |
| PUT/DELETE `/restaurantes/:id` | Editar / eliminar (bloquea si tiene reservas) | |
| PATCH `/restaurantes/:id/estado` | Activar/desactivar (`{activo}`) — oculta del catálogo público si `false` | |
| GET | `/administradores` | Listar+buscar administradores de restaurante |
| PUT `/administradores/:id` | Editar datos | |
| PATCH `/administradores/:id/estado` | Activar/desactivar acceso (`{activo}`) | |
| PATCH `/administradores/:id/password` | Restablece con password aleatoria, devuelta una sola vez en la respuesta | |
| PATCH `/administradores/:id/restaurante` | Reasociar a otro restaurante (`{restauranteId}`) | |

*`/api/panel/restaurante` — solo rol `admin_restaurante`; el `restauranteId` sale siempre del JWT, nunca del cliente:*

| Verbo | Ruta | Acción |
|---|---|---|
| GET | `/reservas?fecha=&estado=&cliente=` | Listado scoped con filtros |
| GET/PUT `/reservas/:id` | Ver / editar | |
| PATCH `/reservas/:id/confirmar` \| `/completar` \| `/cancelar`, DELETE | Cambiar estado / eliminar | |
| GET/POST | `/mesas` | Listar / crear |
| PUT/DELETE `/mesas/:id`, PATCH `/mesas/:id/estado` | Editar / eliminar / cambiar estado | |
| GET/POST | `/promociones` | Listar / crear |
| PUT/DELETE `/promociones/:id`, PATCH `/promociones/:id/estado` | Editar / eliminar / activar-desactivar | |
| GET | `/resenas?q=` | Listar+buscar |
| PATCH `/resenas/:id/aprobar` \| `/ocultar`, DELETE | Moderar / eliminar | |

**Modelos y campos:**

```
Usuario     → id, nombre, apellido, email, telefono, password, rol, restauranteId, activo, foto
Restaurante → id, nombre, categoria, rating, img, descripcion, direccion, activo
Menu        → id, restauranteId, nombre, descripcion, precio, imagen, descuentoPct, stock
Reserva     → id, usuarioId, restauranteId, fecha, hora, personas, estado, total, metodoPago
Favorito    → id, usuarioId, restauranteId
Mesa        → id, restauranteId, capacidad, codigo, estado
Promocion   → id, restauranteId, titulo, descripcion, imagen, fechaInicio, fechaFin, activa
Resena      → id, restauranteId, usuarioId, clienteNombre, comentario, calificacion, fecha, estado
```

- `Menu.descuentoPct` (INTEGER, default 0) — porcentaje de descuento activo sobre el plato (0 = sin descuento)
- `Menu.stock` (INTEGER, nullable) — unidades disponibles; `null` = sin límite, `0` = agotado
- `Reserva.metodoPago` (STRING, default `'local'`) — `'local'` | `'tarjeta'` según el flujo elegido por el usuario
- `Favorito` — par único `(usuarioId, restauranteId)`; un usuario no puede marcar el mismo restaurante dos veces
- `Usuario.rol` — `'cliente'` | `'admin'` (legado) | `'admin_general'` | `'admin_restaurante'`. `Usuario.restauranteId` solo aplica a `admin_restaurante`
- `Mesa.estado` — `'disponible'` | `'ocupada'` | `'mantenimiento'`; `codigo` hace de "número" de mesa
- `Promocion.imagen` — base64 (mismo patrón que la foto de perfil), redimensionada a 640px en el cliente antes de enviarse
- `Resena.estado` — `'pendiente'` | `'aprobada'` | `'oculta'`. No existe todavía un flujo público para que el cliente cree reseñas (HU-15, backlog)

Seed de datos de demostración: `backend/seed_descuentos.js` (manual) · `backend/seeders/seedMesas.js` y `backend/seeders/seedAdminGeneral.js` (automáticos al arrancar)

Cuenta de administrador general de fábrica: `admingeneral@takeit.com` / `AdminGeneral123!` (creada por `seedAdminGeneral.js` si no existe; distinta del `admin@takeit.com` del panel legado)

Asociaciones registradas en `index.js`:
- `Reserva.belongsTo(Restaurante, { as: 'restaurante' })` · `Reserva.belongsTo(Usuario, { as: 'usuario' })`
- `Restaurante.hasMany(Reserva, { as: 'reservas' })` · `hasMany(Usuario, {as:'administradores'})` · `hasMany(Mesa, {as:'mesas'})` · `hasMany(Promocion, {as:'promociones'})` · `hasMany(Resena, {as:'resenas'})`
- `Usuario.belongsTo(Restaurante, { as: 'restauranteAdmin' })` · `Mesa.belongsTo(Restaurante, {as:'restaurante'})` · `Promocion.belongsTo(Restaurante, {as:'restaurante'})` · `Resena.belongsTo(Restaurante, {as:'restaurante'})`, `belongsTo(Usuario, {as:'usuario'})`

### Frontend (`frontend/`)

React 19 + Vite 8 (ESM). Tabler Icons cargado vía CDN en `index.html`.

**Contexto global:**
- `AuthContext.jsx` — JWT en localStorage; expone `registrar`, `iniciarSesion` (retorna `{ok, usuario}`), `cerrarSesion`, `actualizarPerfil`, `actualizarFoto`, `usuarioActual`
- `ProtectedRoute.jsx` — `PrivateRoute` (redirige a `/login` sin sesión) · `PublicRoute` (con sesión, redirige según `usuarioActual.rol`: `admin_general`→panel general, `admin_restaurante`→panel restaurante, resto→`/inicio`)
- `Admin/AdminRoute.jsx` — guard por rol para el panel de administración: sin sesión → `/login`; rol no permitido → `/acceso-denegado`

**Rutas:**

| Path | Componente | Guard |
|------|-----------|-------|
| `/login` | `Login` | PublicRoute |
| `/registro` | `Register` | PublicRoute |
| `/inicio` | `Inicio` | PrivateRoute |
| `/contenido/:id` | `ContenidoRestaurante` | PrivateRoute |
| `/perfil` | `Perfil` | PrivateRoute |
| `/favoritos` | `Favoritos` | PrivateRoute |
| `/nosotros` | `SobreNosotros` | PrivateRoute |
| `/admin` | `routes/Admin/Admin.jsx` (panel legado) | PrivateRoute |
| `/acceso-denegado` | `Admin/AccesoDenegado.jsx` | PrivateRoute |
| `/panel/general/{dashboard,restaurantes,administradores,configuracion}` | `Admin/General/*` bajo `Admin/layout/AdminLayout.jsx` | AdminRoute `roles=['admin_general']` |
| `/panel/restaurante/{reservas,mesas,promociones,resenas}` | `Admin/Restaurante/*` bajo `Admin/layout/AdminLayout.jsx` | AdminRoute `roles=['admin_restaurante']` |

**Paleta de colores** (variables en `index.css` — usar siempre estas, no valores fijos):

```css
--naranja: #c2440e        --naranja-hover: #a8370b
--naranja-suave: #FFF7ED  --negro: #1a1714
--blanco: #ffffff          --fondo: #faf9f7
--borde: #e8e3da           --borde-input: #e0dbd3
--texto-muted: #9a958e     --placeholder: #b0aba4
```

**Iconos:** usar `<i className="ti ti-nombre" />` (Tabler Icons). No usar emojis en componentes nuevos. El paquete `@tabler/icons-webfont` cargado en `index.html` solo trae la variante *outline* — no existen íconos `-filled` (ej. usar `ti-heart`, no `ti-heart-filled`); verificar cualquier nombre nuevo contra el CSS del CDN antes de usarlo.

El frontend llama al backend en `http://localhost:3000/api` (hardcodeado en `AuthContext`). JWT se envía como `Authorization: Bearer <token>`.

**Panel de administración** (`frontend/src/Admin/`) — todo el módulo administrativo nuevo vive aquí, separado de `routes/`:

```
Admin/
  AdminRoute.jsx, AccesoDenegado.jsx      # guard por rol y página 403
  layout/     AdminLayout.jsx, Sidebar.jsx, Topbar.jsx, Breadcrumbs.jsx, navConfig.js
  components/ DataTable, Modal, ConfirmDialog, StatCard, StatusBadge, FormField, AlertBanner (+ components.css compartido)
  hooks/      useAdminApi.js               # fetch a /api/panel/..., authHeaders(), desempaqueta {ok,data}
  General/    Dashboard, RestaurantesLista(+FormModal), AdministradoresLista(+FormModal), ConfiguracionGeneral
  Restaurante/ ReservasLista(+DetalleModal), MesasLista(+FormModal), PromocionesLista(+FormModal), ResenasLista
```

Primer uso de rutas anidadas de React Router en el proyecto (`AdminLayout` + `<Outlet/>` para mantener sidebar/topbar persistentes). Tema oscuro reutilizando la receta de fondo de `Inicio.css`/`Perfil.css` con acentos `var(--naranja)`. `ConfiguracionGeneral.jsx` es solo interfaz (sin backend), según lo pedido. Coexiste con el panel legado (`routes/Admin/`, rol `'admin'`) sin tocarlo — son dos sistemas independientes montados en rutas distintas (`/admin` vs `/panel/...`).

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

#### Jornada 2 — 25 junio 2026 · 09:00–13:00 (Descuentos, Stock y Métodos de Pago)

**Backend**
- `ADD` Campo `descuentoPct` (INTEGER, default 0) en modelo `Menu` — porcentaje de descuento por plato
- `ADD` Campo `stock` (INTEGER, nullable) en modelo `Menu` — control de disponibilidad por plato
- `ADD` Campo `metodoPago` (STRING, default `'local'`) en modelo `Reserva`
- `ADD` Script `backend/seed_descuentos.js` — carga descuentos y stock de demo en Neon con un solo `node seed_descuentos.js`

Descuentos de demo activos:

| Restaurante | Plato(s) | Descuento |
|---|---|---|
| Maido | Sushi Acevichado | 20% |
| Central | Nixtamal, Costa | 15% |
| La Mar | Ceviche Mixto, Leche de Tigre, Jalea Mixta | 15% |
| Astrid & Gastón | Suspiro Limeño | 25% |

Platos agotados de demo: Lomo Saltado Nikkei (Maido), Alturas (Central), Cochinillo (Astrid & Gastón), Sudado de Mero (La Mar). Todos los demás platos tienen `stock = 10` como límite por pedido.

**Frontend — `/contenido/:id`**
- `ADD` Overlay "NO DISPONIBLE" + icono sobre imagen del plato cuando `stock === 0`
- `ADD` Badge `-X%` en naranja sobre imagen cuando `descuentoPct > 0`
- `ADD` Precio original tachado + precio con descuento en naranja en tarjeta de plato
- `ADD` Bloqueo de botón `+` al alcanzar límite de 10 unidades con mensaje "Límite de 10 und."
- `ADD` Línea "Descuento aplicado − S/ X.XX" en bloque de totales del sidebar (fondo naranja sutil, monto en naranja)
- `ADD` Dos botones de pago: **Pagar en local** (confirma reserva, paga al llegar) y **Pagar ahora** (abre modal)
- `ADD` Modal de pago con tarjeta: campos número, nombre, vencimiento y CVV con formato automático. Simula procesamiento y confirma reserva con `metodoPago: 'tarjeta'`

**Frontend — `/inicio`**
- `CHANGE` Tarjeta de promoción Astrid & Gastón: badge `+ Postre` → `-25%`, descripción actualizada a descuento en Suspiro Limeño

**Frontend — `/perfil`**
- `ADD` Chip de método de pago en tarjeta de reserva: "Pagado con tarjeta" (naranja) o "Paga en local" según `metodoPago`
- `ADD` Etiqueta verde "con descuento" bajo el monto cuando la reserva tiene preorden

#### Jornada 2 — 25 junio 2026 · 14:00–18:00 (UX Perfil, Filtros y Correcciones)

**Backend**
- `FIX` `backend/routes/reservas.js` — `metodoPago` no se incluía en el destructuring del body ni se pasaba a `servicio.crear()`. La columna existía en el modelo pero el campo se descartaba silenciosamente. Ahora se persiste correctamente en Neon.

**Frontend — `AuthContext.jsx`**
- `ADD` Función interna `setUserWithFoto(user)` — al cargar sesión desde localStorage, lee automáticamente `foto_<userId>` y la adjunta a `usuarioActual.foto`
- `ADD` Función `actualizarFoto(base64)` expuesta en el contexto — guarda en `foto_<userId>` y actualiza el estado global. La foto ya no queda limitada al componente Perfil

**Frontend — `/inicio`**
- `FIX` Navbar: avatar muestra la foto de perfil del usuario si existe (`usuarioActual.foto`), en lugar de mostrar siempre la inicial
- `CHANGE` Sección Promociones: Central badge `2×1` → `-15%` y descripción actualizada a los platos reales con descuento (Nixtamal y Costa). La Mar actualizada a Ceviche Mixto, Leche de Tigre y Jalea Mixta
- `CHANGE` Bloque de condiciones eliminado de todas las tarjetas de promo. Reemplazado por chip **"Válido solo por WEB"**

**Frontend — `/perfil`**
- `ADD` Filtros de reservas: tabs **Activas / Canceladas / Finalizadas** junto al título. El contador de reservas refleja siempre el filtro activo
- `ADD` Botón **Cancelar reserva** al pie de cada tarjeta activa — llama a `PATCH /api/reservas/:id/cancelar` y actualiza la lista en tiempo real sin recargar
- `CHANGE` Número de ticket: `#7` → `RS-0007` (prefijo RS + id con ceros a la izquierda, 4 dígitos)
- `CHANGE` Timeline de estados renombrado: **Registrada → Por confirmar → Confirmada**. Al crear una reserva nueva, "Registrada" aparece con checkmark verde y "Por confirmar" se ilumina en naranja, indicando que espera aprobación del admin
- `FIX` Prefijo de teléfono: al abrir el editor, el número guardado (`+51 987...`) se parsea separando prefijo y número. Se elimina la duplicación acumulativa del prefijo en cada guardado

#### Jornada 3 — 11 julio 2026 (Favoritos de restaurantes)

**Backend**
- `ADD` Modelo `Favorito` (`usuarioId`, `restauranteId`, par único) — Sequelize auto-migra la tabla `favoritos`
- `ADD` `FavoritoServicio` (`obtenerPorUsuario`, `agregar` vía `findOrCreate`, `quitar`)
- `ADD` Rutas privadas `GET /api/favoritos/:usuarioId`, `POST /api/favoritos`, `DELETE /api/favoritos/:usuarioId/:restauranteId`
- `ADD` Asociación `Favorito.belongsTo(Restaurante, { as: 'restaurante' })` para traer los datos del restaurante en el listado

**Frontend — `/inicio`**
- `ADD` Botón de corazón (♥) sobre la imagen de cada tarjeta de restaurante para marcar/desmarcar favorito, con actualización optimista
- `ADD` Pill de filtro "Favoritos" junto a los dropdowns de Calificación/Tipo — muestra solo los restaurantes marcados
- `ADD` Entrada "❤️ Mis Favoritos" en el menú desplegable del usuario, junto a "Mi Perfil"

**Frontend — `/contenido/:id`**
- `ADD` Botón de corazón sobre el banner del restaurante para marcar/desmarcar favorito desde el detalle

**Frontend — `/favoritos`** (página nueva, `routes/Favoritos/Favoritos.jsx`)
- `ADD` Página dedicada con header sticky (volver a `/inicio`) y grid de tarjetas de los restaurantes marcados como favoritos (imagen, rating, categoría, dirección)
- `ADD` Botón para quitar de favoritos directo desde la tarjeta, sin pasar por el detalle del restaurante
- `ADD` Estado vacío con CTA "Explorar restaurantes" cuando el usuario no tiene favoritos aún

**HU-18 — detalle:** *Como cliente quiero poder marcar restaurantes como favoritos y volver a ellos rápidamente desde una sección dedicada, sin tener que buscarlos de nuevo.*
- Implementado: toggle de corazón en `/inicio` (tarjetas) y `/contenido/:id` (banner), filtro rápido en el inicio, y página `/favoritos` accesible desde el menú de usuario. Persistido en Neon vía tabla `favoritos`, ligado al usuario autenticado.

#### Jornada 4 — 12 julio 2026 (Panel de Administración: General y Restaurante)

**Backend**
- `ADD` `Usuario.restauranteId` (nullable, solo `admin_restaurante`) y `Usuario.activo` (BOOLEAN default true, bloquea el login si es `false`) + `Usuario.associate` (`belongsTo Restaurante as 'restauranteAdmin'`)
- `ADD` `Restaurante.activo` (BOOLEAN default true) — el catálogo público (`GET /api/restaurantes`) solo devuelve restaurantes activos
- `ADD` `Mesa.estado` (disponible/ocupada/mantenimiento) + `Mesa.associate`; `codigo` funciona como "número" de mesa
- `ADD` Modelos `Promocion` (título, descripción, imagen base64, fechaInicio/Fin, activa) y `Resena` (cliente, comentario, calificación, fecha, estado pendiente/aprobada/oculta)
- `ADD` Middleware `verificarRol(...roles)` — RBAC genérico, independiente del `verificarAdmin` legado
- `ADD` Servicios: extensión de `RestauranteServicio`/`UsuarioServicio`/`MesaServicio`/`ReservaServicio` con CRUD y cambios de estado scoped por restaurante; nuevos `PromocionServicio`, `ResenaServicio`, `DashboardServicio` (resumen de KPIs) y `AdminGeneralServicio` (crea restaurante + su admin en una transacción)
- `ADD` Rutas `/api/panel/general/*` (rol `admin_general`: dashboard, CRUD de restaurantes con creación de su admin, CRUD/activación/reset-password de administradores) y `/api/panel/restaurante/*` (rol `admin_restaurante`: reservas con filtros y cambio de estado, mesas, promociones, reseñas — siempre aisladas por `restauranteId` del JWT, nunca del cliente)
- `ADD` `backend/seeders/seedAdminGeneral.js` — crea `admingeneral@takeit.com` al arrancar si no existe (idempotente, igual que `seedMesas`)
- `CHANGE` `auth.js` — `login`/`register` incluyen `restauranteId` y `activo` en el JWT y en el `usuario` devuelto; login rechaza cuentas con `activo:false`
- Convive con el panel legado (`/api/admin`, rol `'admin'`) sin modificarlo — son dos sistemas RBAC independientes por decisión explícita del equipo

**Frontend — `frontend/src/Admin/`** (módulo nuevo, ver estructura arriba)
- `ADD` Layout con sidebar colapsable (desktop) / off-canvas (móvil), topbar y breadcrumbs, distinto según `ambito` (`general` | `restaurante`)
- `ADD` General: Dashboard (7 tarjetas KPI), Restaurantes (listar/buscar/crear con su admin/editar/activar-desactivar/eliminar), Administradores (listar/buscar/editar/activar-desactivar/restablecer contraseña/asociar restaurante), Configuración (solo interfaz, sin backend)
- `ADD` Restaurante: Reservas (filtros fecha/estado/cliente, ver/editar/confirmar/completar/cancelar/eliminar), Mesas (CRUD + cambio de estado inline), Promociones (grid de tarjetas, imagen redimensionada a 640px en el cliente), Reseñas (buscar/aprobar/ocultar/eliminar)
- `ADD` `AdminRoute` (guard por rol) y página `/acceso-denegado`
- `CHANGE` `AuthContext.iniciarSesion` ahora retorna `{ok, usuario}` (antes solo `{ok}`), para poder redirigir por rol inmediatamente tras el login
- `CHANGE` `Login.jsx` redirige a `/panel/general/dashboard` o `/panel/restaurante/reservas` según `usuario.rol`; clientes y el admin legado (`rol:'admin'`) siguen yendo a `/inicio` sin cambios
- `CHANGE` `PublicRoute` ya no fuerza `/inicio` a un admin logueado que visita `/login` — redirige según su rol

**HU-14 — detalle:** *Como plataforma, necesito un panel de administración con dos roles (general y por restaurante) protegido por rol vía JWT, con CRUD completo de restaurantes/administradores/mesas/promociones/reseñas y aislamiento estricto entre restaurantes.*
- Implementado end-to-end: modelos, RBAC, 24 endpoints nuevos y el módulo `frontend/src/Admin/` completo. Verificado con curl (creación transaccional de restaurante+admin, login del nuevo admin, aislamiento cross-tenant devolviendo 404, bloqueo de acceso cruzado entre roles con 403) y con `npm run build`/`eslint` del frontend en verde.

| HU | Alias | Prioridad | Pts |
|----|-------|-----------|-----|
| HU-01 | Registro — completar (bcrypt + recuperar contraseña) | Must Have | 5 |
| HU-05 | Perfil usuario editable | Must Have | 5 |
| HU-06 | Cancelar desde historial | Must Have | 5 |
| HU-07 | POST /reservas end-to-end | Must Have | 8 |
| HU-08 | Sección Promociones en inicio | Should Have | 3 |
| HU-09 | Capacidad de mesa + observaciones | Should Have | 5 |
| HU-10 | Página Sobre Nosotros | Should Have | 3 |
| HU-12 | Confirmación de reserva con número | Must Have | 8 |
| HU-14 | Panel admin (protegido por rol JWT) — ✅ completado | Must Have | 8 |
| HU-15 | Reseñas post-visita | Should Have | 5 |
| HU-16 | Recordatorio por email (Nodemailer + cron) | Should Have | 5 |
| HU-18 | Favoritos de restaurantes — ✅ completado | Could Have | 3 |

> HU-13 eliminada: sus pendientes (bcrypt + olvidar contraseña) pertenecen a HU-01 del R1, que se completa en R2.  
> HU-17 (Pagos Culqi) aplazada a Release 3.

**HU-01 — detalle:** *Como cliente quiero que mi contraseña se almacene con hash bcrypt y poder recuperarla si la olvido mediante un correo con enlace temporal.* (Pendiente de R1 registrado en BACKLOG_DESPUES_SPRT1.docx)
- Backend: `bcrypt.hash()` al registrar y al cambiar contraseña. Endpoint `POST /auth/recuperar` genera token temporal (válido 3 min, un solo uso) y envía email con Nodemailer.

**HU-08 — detalle:** *Como cliente quiero ver una sección de promociones vigentes en el inicio (descuentos, 2×1, cortesías) que me lleven directamente al restaurante correspondiente.*
- Implementado: 4 tarjetas con badge de oferta, condiciones, imagen y botón que navega al restaurante si existe en la DB.

**HU-09 — detalle:** *Como cliente quiero indicar la capacidad de mesa que necesito (para 2, para 3 o para 4 o más personas) y añadir observaciones de preferencia de ubicación al hacer mi reserva.*
- Frontend: selector de capacidad (Mesa para 2 / Mesa para 3 / Mesa para 4 o más) + campo de texto libre "Observaciones" en el sidebar de reserva (`/contenido/:id`)
- Backend: campos `capacidadMesa` y `observaciones` en modelo `Reserva` (Sequelize auto-migra), incluidos en `POST /api/reservas` y visibles en tarjeta del perfil

**HU-10 — detalle:** *Como visitante quiero acceder a una página que presente al equipo de desarrollo, la propuesta de valor de la plataforma y el stack técnico, para entender quiénes construyeron Take&It y con qué tecnología.*
- Implementado: página `/nosotros` con sidebar fijo de imágenes, sección de equipo (6 integrantes con fotos y roles), features del R1, stack técnico con iconos y footer con créditos.
