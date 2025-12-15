# Authrix Website

React website (Vite + TypeScript + Tailwind) providing:
- Landing page
- Login
- Register
- Dashboard

## Setup

1) Create an env file:

```bash
cp .env.example .env
```

2) Install deps and run:

```bash
npm install
npm run dev
```

## Required backend

The Authrix server should be running (default `http://localhost:3000`).

This website calls these endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh` (refresh token in `Authorization: Bearer <refreshToken>`)
- `GET /api/auth/profile`
- `GET /api/auth/sessions`
- `POST /api/auth/logout` (refresh token in `Authorization: Bearer <refreshToken>`)
- `POST /api/auth/logout-all`

All requests include `X-API-Key`.
