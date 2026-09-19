# Mr. Tux — website

Live site for Mr. Tux (South Florida tuxedo rentals, est. 1977). React + Vite single-page
app, deployed on Vercel, built and maintained by Figve Creative.

## Stack

- **React 18 + TypeScript**, built with **Vite 5**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives) for components
- **React Router v6** for client-side routing
- **React Hook Form + Zod** for form handling/validation
- **TanStack Query** for data fetching
- Backend: not yet connected — see `docs/STATUS.md`. When it lands it will be **Supabase**,
  not Lovable Cloud.
- Hosting: **Vercel**, auto-deploys on every push to `main`

## Getting started

```bash
npm install
npm run dev       # local dev server, http://localhost:5173
npm run build     # production build to /dist
npm run lint      # eslint
npm run test      # vitest
```

## Project structure

```
src/
  pages/          one file per route (Home, Collection, LookDetail, StartOrder, ...)
  components/     shared components; components/ui is shadcn — avoid hand-editing, regenerate instead
  components/layout/  Header, Footer, Layout wrapper
  data/           static content and inventory data (looks.ts, content.ts)
  context/        React context (app-wide state: bag, size profile, etc.)
  lib/            site-wide constants and helpers
  assets/         images, used via `@/assets/...` imports
public/
  fonts/          licensed NewYork webfont (do not redistribute outside this project)
docs/             project status, architecture notes
```

## Deploying

Every push to `main` auto-deploys via Vercel. `vercel.json` handles the SPA rewrite so
client-side routes don't 404 on refresh. There's no staging environment yet — see
`CONTRIBUTING.md` for how we handle that given the current team size.

## Where things stand

See `docs/STATUS.md` for what's live, what's placeholder, and what's still open.
