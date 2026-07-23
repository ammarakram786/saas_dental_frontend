# Dental SaaS — Frontend

Nuxt 4 UI for platform admin, clinic workspaces, and patient flows. Talks to the Django API through Nitro server routes (session cookies via `nuxt-auth-utils`).

## Requirements

- Node.js 22+ (recommended; matches the Dockerfile)
- Backend API running (default local bind `127.0.0.1:5000`)

## Quick start

```bash
cd frontend
npm install

# create env files from the examples below
# .env          → local / npm run dev
# .env.production → production build / systemd

npm run dev
```

Dev server listens on `http://0.0.0.0:3030` (see `nuxt.config.ts`).

## Environment

Nuxt loads `.env` in development and `.env.production` for production builds. Runtime config is defined in `nuxt.config.ts`.

Generate a session password (32+ characters):

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(48))"
```

### Local — `.env`

```env
# Must match gunicorn / runserver bind
NUXT_API_BASE=http://127.0.0.1:5000

# Required: 32+ chars or setUserSession throws "Empty password"
NUXT_SESSION_PASSWORD=dev-session-password-at-least-32-chars!!

# Secure cookies only work over HTTPS
NUXT_SESSION_SECURE=false

HOST=0.0.0.0
PORT=3030
```

### Production — `.env.production`

```env
# Server-side URL Nuxt uses to reach Django (same host / private network is fine)
NUXT_API_BASE=http://127.0.0.1:5000

NUXT_SESSION_PASSWORD=replace-with-32-plus-char-random-password

# Set true only when the site is served over HTTPS
NUXT_SESSION_SECURE=false

HOST=0.0.0.0
PORT=3030
```

### Variable reference

| Variable | Required | Notes |
|----------|----------|--------|
| `NUXT_API_BASE` | yes | Base URL of the Django API. Keep in sync with gunicorn `--bind` (Docker/backend default `:5000`; code fallback is `:5500`) |
| `NUXT_SESSION_PASSWORD` | yes | Encrypts the auth session cookie; **must be 32+ characters** |
| `NUXT_SESSION_SECURE` | no | `true` → `Secure` cookie flag. Use `false` on plain HTTP (nginx `:80`); browsers drop secure cookies otherwise |
| `HOST` | no | Bind address for the Node server (`0.0.0.0` for LAN/Docker) |
| `PORT` | no | Listen port (default `3030`) |

## Scripts

```bash
npm run dev       # development server
npm run build     # production build → .output/
npm run preview   # preview production build locally
```

Production process (after `npm run build`):

```bash
node .output/server/index.mjs
```

Point systemd `EnvironmentFile=` at `.env.production` (or a deployed `.env`).

## Docker

```bash
docker build -t dental-saas-frontend .
docker run --env-file .env.production -p 3030:3030 dental-saas-frontend
```

## Notes

- Browser calls go to same-origin `/api/...`; the Nitro server proxies to `NUXT_API_BASE`.
- Do not commit real `.env` / `.env.production` files (they are gitignored). Keep secrets out of git; use the examples in this README when onboarding.
