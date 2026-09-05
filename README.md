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

Set `SESSION_SECRET` to a random value containing at least 32 characters before
deploying. It protects the encrypted authentication and registration cookies.
Set the server-only `YAHWE_API_URL` to the Yahwe-Eita API base URL, including
its `/api` prefix. Keep the real value in `.env.local` locally and in your
deployment provider's environment settings in production.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Architecture

- Next.js App Router
- TypeScript in strict mode
- Tailwind CSS
- Server-rendered application shell with TanStack Query for live account data
- One typed query or mutation hook per application endpoint
- Progressive Web App manifest and install icons
- Offline fallback without caching private account data
- Secure, server-only API proxy and encrypted HTTP-only sessions

## Application routes

- `/onboarding` — introduction and terms
- `/sponsor` — sponsor verification
- `/register/*` — Mobile Money, identity, registration, and payment flow
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
