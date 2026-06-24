# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Take-It** is a restaurant reservation web app. Users can browse restaurants, view menus, make reservations, and manage their profile.

## Running the Project

Both services must run simultaneously. Start them in separate terminals from the `Take-It/` root.

**Backend** (port 3000):
```bash
cd backend
npm install
node index.js
```

**Frontend** (port 5173 via Vite):
```bash
cd frontend
npm install
npm run dev
```

**Lint frontend:**
```bash
cd frontend && npm run lint
```

## Environment Setup

Create `backend/.env` with these variables (values not committed to git):
```
DATABASE_URL=<neon-postgres-connection-string>
PORT=3000
JWT_SECRET=<your-secret>
```

The backend connects to a hosted Neon PostgreSQL instance over SSL. On startup, Sequelize runs `sync({ alter: true })` — it auto-migrates the schema to match the models.

## Architecture

### Backend (`backend/`)

CommonJS Express 5 app with a layered architecture:

- **`index.js`** — wires Express, CORS, routes, and Sequelize startup
- **`database.js`** — Sequelize instance (PostgreSQL + SSL via `DATABASE_URL`)
- **`models/`** — Sequelize model definitions: `Usuario`, `Restaurante`, `Menu`, `Reserva`
- **`services/`** — business logic classes (`UsuarioServicio`, `RestauranteServicio`, `ReservaServicio`, `MenuServicio`)
- **`routes/`** — Express routers (`auth`, `restaurantes`, `reservas`, `menu`)
- **`factories/`** — two factory classes:
  - `ServicioFactory` — instantiates the correct service by string key (`'usuario'`, `'restaurante'`, etc.)
  - `ResponseFactory` — standardizes HTTP responses with `{ ok, mensaje, data }` shape

All routes go through `ServicioFactory.crear(tipo)` to get a service instance, and use `ResponseFactory` methods to return consistent JSON.

**API routes:**
- `POST /api/auth/register` — register new user, returns JWT
- `POST /api/auth/login` — login, returns JWT
- `GET/POST /api/restaurantes` — list/create restaurants
- `GET /api/restaurantes/:id/menu` — restaurant menu
- `GET/POST/DELETE /api/reservas` — reservations (JWT-protected)

### Frontend (`frontend/`)

ESM React 19 app bundled with Vite 8.

- **`src/main.jsx`** — entry point
- **`src/App.jsx`** — routing root; wraps everything in `AuthProvider` and uses `BrowserRouter`
- **`src/context/AuthContext.jsx`** — global auth state; stores `token` + `usuario` in `localStorage`; exposes `registrar`, `iniciarSesion`, `cerrarSesion`, `usuarioActual`
- **`src/context/ProtectedRoute.jsx`** — `PrivateRoute` (redirects to `/login` if no session) and `PublicRoute` (redirects to `/inicio` if already logged in)

**Frontend routes:**
| Path | Component | Guard |
|------|-----------|-------|
| `/login` | `Login` | PublicRoute |
| `/registro` | `Register` | PublicRoute |
| `/inicio` | `Inicio` | PrivateRoute |
| `/contenido/:id` | `ContenidoRestaurante` | PrivateRoute |
| `/perfil` | `Perfil` | PrivateRoute |

The frontend calls the backend at `http://localhost:3000/api` (hardcoded in `AuthContext`). JWT is sent via `Authorization: Bearer <token>` header for protected endpoints.

Each page component lives in its own folder under `src/routes/` or `src/Main/` and has a co-located `.css` file.
