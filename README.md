# Sudut Flora Frontend

Vue 3 and Vite single-page application for the Sudut Flora public website and admin panel.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

The default backend URL is `http://127.0.0.1:8000`, matching the Vite development host. Change `VITE_API_BASE_URL` in `.env` when the Laravel API runs elsewhere. Keep both applications on the same hostname so Sanctum can read the XSRF cookie.

## Build

```bash
npm run build
```

Public pages use `/`, while the admin login is available at `/admin/login`. Admin registration is intentionally not provided.
