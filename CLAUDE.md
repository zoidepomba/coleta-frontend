# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm start          # Start Expo development server (Metro bundler)
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator/device
```

No linting or test framework is configured.

### Backend (FastAPI + PostgreSQL)

```bash
cd backend
docker-compose up -d          # Start PostgreSQL container
pip install -r requirements.txt
cp .env.example .env          # Fill in SECRET_KEY and DATABASE_URL
uvicorn app.main:app --reload # Start API server on :8000
```

The `.env` must set `DATABASE_URL=postgresql://postgres:senha@localhost:5432/coletaapp` (matches docker-compose defaults).

## Architecture Overview

ColetaApp is a React Native/Expo mobile app connecting residents with waste collection providers. The project now has a real FastAPI backend with JWT authentication — previously the UI was fully mocked.

### Navigation

React Navigation native stack with two conditional stacks in `App.js`:
- **AuthStack:** `Login → Register`
- **AppStack:** `Home → Prestadores → Confirmacao → Sucesso → Historico`

`RootNavigator` reads `user` from `AuthContext` — renders `AuthStack` if null, `AppStack` if authenticated (shows a spinner while the session is being restored from SecureStore). All screen headers are hidden; the custom `Header` component handles header UI.

Order data (provider, wasteType, total) flows forward through `navigation.navigate()` params — no shared store beyond auth.

### State & Data

- **Local `useState`** for all screen-level state.
- **`AuthContext`** (`src/context/AuthContext.js`) is the only React Context — provides `user`, `loading`, `login()`, `register()`, `logout()`. On mount it restores the JWT from `expo-secure-store` and calls `GET /auth/me` to rehydrate the user object.
- **Mock data** for the booking flow lives in `src/data/mock.js`: `WASTE_TYPES`, `PROVIDERS`, `PAYMENT_METHODS`, and `APP_FEE = 2`.

### API Layer

`src/services/api.js` exports:
- A default `api` Axios instance pointing to `http://10.0.2.2:8000` (Android emulator host). Change this for iOS simulator or physical devices.
- A request interceptor that reads the JWT from SecureStore and attaches a `Bearer` header automatically.
- `authService` with `login(email, password)`, `register(name, email, password)`, and `me()`.

### Backend (FastAPI)

Entry point: `backend/app/main.py`. CORS is fully open (for dev). Key modules:

| File | Role |
|---|---|
| `models.py` | SQLAlchemy `User` model (id, name, email, password_hash, created_at) |
| `auth.py` | bcrypt hashing + JWT creation/decoding |
| `config.py` | Pydantic `Settings` loaded from `.env` (DATABASE_URL, SECRET_KEY, 30-day token expiry) |
| `routes/auth.py` | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |

Passwords are bcrypt-hashed. Tokens expire in 43 200 minutes (30 days).

### Design System

All design tokens are in `src/theme/index.js` — import from there, never hardcode values:
- Primary accent: `#1DB976` (green)
- Exports: `colors`, `spacing` (xs/sm/md/lg/xl/xxl), `radius`, `typography` (preset objects with fontSize + fontWeight + color), `shadows`

### Component Library

All reusable UI lives in `src/components/index.js`: `Button`, `Card`, `FadeCard`, `Avatar`, `Badge`, `Stars`, `SectionLabel`, `Divider`, `EmptyState`, `Header`, `BottomNav`.

`FadeCard` wraps list items with a staggered fade-in + translateY animation via React Native's `Animated` API (pass a `delay` prop). `BottomNav` shows active state with a small dot indicator.

### Language

All UI text is in Portuguese (pt-BR).

## Current State

- Auth is real: register/login hit the FastAPI backend, tokens persist in SecureStore.
- The booking flow (Prestadores → Confirmacao → Sucesso) still uses mock data from `src/data/mock.js` — no real provider or order API yet.
- `ConfirmacaoScreen` simulates async confirmation with `setTimeout`.
- `HistoricoScreen` shows an empty state (no orders API).
