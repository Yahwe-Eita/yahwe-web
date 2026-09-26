# Yahwe-Eita Web

The Next.js Progressive Web App for Yahwe-Eita.

## Requirements

- Node.js 20.9 or newer
- npm

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `SESSION_SECRET` to a random value containing at least 32 characters, in
every environment including local development. It protects the encrypted
authentication and registration cookies; without it the app refuses to serve
signed-in or registration pages.
Set the server-only `YAHWE_API_URL` to the Yahwe-Eita API base URL, including
its `/api` prefix. Keep the real value in `.env.local` locally and in your
deployment provider's environment settings in production.
Set the server-only `CONTACT_WEBHOOK_URL` to the contact workflow's HTTP trigger
URL so the landing page contact form can deliver messages.

## Docker

The `Dockerfile` builds a standalone Node server that listens on port 3000.
Pass the environment variables above at run time; nothing secret is baked into
the image.

```bash
docker build -t yahwe-web .
docker run -p 3000:3000 --env-file .env.local yahwe-web
```

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Route handler tests run against a fake upstream API (`tests/upstream.ts`), so
they need no running backend.

## Architecture

- Next.js App Router
- TypeScript in strict mode
- Tailwind CSS
- Server-rendered application shell with TanStack Query for live account data
- One typed query or mutation hook per application endpoint
- Progressive Web App manifest and install icons
- Offline fallback without caching private account data
- Secure, server-only API proxy and encrypted HTTP-only sessions; an expired
  access token is refreshed once on the server, and a rejected refresh ends the
  session
- Programme figures (fee, rewards, windows, minimum age) come from the API's
  `/programme` endpoint; no money figure is written into the client
- Icons are bundled from `src/components/icons/mingcute.json`; add an icon there
  before using it

## Application routes

- `/` — landing page: about, rewards, how it works, terms, FAQ, and contact
- `/onboarding` — introduction and terms
- `/sponsor` — sponsor verification
- `/register/*` — Mobile Money number confirmed by SMS code, details, and payment
- `/login` and `/reset-password` — account access
- `/dashboard` — rewards, cycle progress, and invitations
- `/genealogy` — downline list and tree
- `/transactions` — transaction history
- `/profile` and `/settings` — account details and preferences

All Yahwe-Eita API tokens and in-progress registration details remain in sealed,
HTTP-only cookies. Passwords and tokens are never written to browser-accessible
storage.

Client components call hooks from `src/hooks`. Those hooks use Axios against
same-origin `src/app/api` route handlers; only the server communicates with the
upstream Yahwe-Eita API.
