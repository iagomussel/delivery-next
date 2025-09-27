# DeliveryNext – Agents Guide

This file gives agents practical, high‑signal guidance to work safely and efficiently in this repository. The scope is the entire repo.

## Stack & Conventions
- Runtime: Next.js 15 (App Router) + React 18 + TypeScript.
- Styling: Tailwind CSS 3, shadcn/ui primitives, tailwindcss-animate.
- Icons: `lucide-react` (pinned to `^0.544.0`).
- Data: Prisma 5 (SQLite in dev via `DATABASE_URL`), see `prisma/schema.prisma`.
- Auth: Lightweight JWT helpers in `src/lib/auth.ts`.

## Repo Layout
- App routes: `src/app/**` (server routes under `src/app/api/**`).
- UI primitives: `src/components/ui/**` (shadcn-style components). Reuse existing primitives before adding new ones.
- Utilities: `src/lib/**` (e.g., `utils.ts`, `auth.ts`, `prisma.ts`, tokens in `tokens.ts`).
- Global styles and tokens: `src/app/globals.css`.
- Tailwind config: `tailwind.config.mjs` (maps CSS variables directly).

## Running Locally
- Copy `env.example` to `.env` and set at least: `DATABASE_URL`, `JWT_SECRET`, `NEXTAUTH_URL`.
- Windows-friendly install path:
  - `npm install --ignore-scripts`
  - `npx prisma generate`
  - `npx prisma db push`
- Start: `npm run dev` (or `npx next dev` if `next` isn’t on PATH).

## Theming Rules (Important)
- We use shadcn themes with OKLCH variables written in `src/app/globals.css`.
- Tailwind color mapping must reference raw CSS variables, not `hsl(var(--...))`.
  - Example mapping in `tailwind.config.mjs`:
    - `primary.DEFAULT: 'var(--primary)'`
    - `foreground: 'var(--foreground)'`
- When adding or changing themes via shadcn CLI, do NOT revert mappings back to `hsl(var(--...))`.
- Prefer using semantic tokens (`bg-card`, `text-muted-foreground`, etc.) via the Tailwind extension.

## UI Components
- Add primitives under `src/components/ui/` following current style (functional components, `cn` from `@/lib/utils`, shadcn’s variant patterns where needed).
- Avoid re-implementing primitives that already exist (`button`, `input`, `card`, `badge`, etc.).
- Accessibility: Always label inputs, set `aria-*` where error states apply, and keep focus rings consistent.

## API Routes
- Location: `src/app/api/**/route.ts`.
- Auth: For management endpoints, require `Authorization: Bearer <token>`, decode with `verifyToken` from `src/lib/auth.ts`.
- Multi-tenant: Scope queries by `tenantId` from the token via related models (e.g., restaurant → tenant).
- Validation: Keep payload checks minimal and explicit; prefer adding zod schemas if the task asks for stricter validation.
- Numbers/Decimals: Convert Prisma `Decimal` to JS `Number` in JSON responses where appropriate.

## Prisma & Data
- Schema: `prisma/schema.prisma`. If you change it, prefer additive/migration-safe edits.
- For local dev: after schema changes run `npx prisma generate` and `npx prisma db push`.
- Do not commit generated clients or local DB files unless explicitly requested.

## Security & Production
- Security headers are configured in `next.config.js`.
- Keep JWT secret read from `process.env.JWT_SECRET` only.
- Avoid leaking tokens or secrets into logs—return generic errors on auth failures.

## Code Style
- TypeScript, ES modules.
- Small, focused changes aligned with existing patterns; avoid broad refactors unless requested.
- Prefer `@/` absolute imports.
- Use `cn(...)` helper for class merging.

## Do / Don’t
- Do
  - Keep UI consistent with shadcn and the active theme.
  - Enforce tenant scoping in admin/owner/staff APIs.
  - Add endpoints and pages in the smallest increments that satisfy the task.
- Don’t
  - Reintroduce `hsl(var(--...))` color mapping.
  - Change environment, CI, or deployment configuration unless the task requires it.
  - Commit secrets or modify `env.example` with real values.

## Known Quirks
- Some legacy text may contain mojibake (encoding artifacts). Save files as UTF‑8 when editing.
- On Windows, `postinstall` may fail mid-install; use the `--ignore-scripts` flow and run Prisma commands manually.

## Using Plans (for agents)
- For multi-step tasks, keep a short plan and update it as you complete steps.
- Prefer surgical patches via `apply_patch`. Avoid unrelated edits.

---
If anything is unclear, prefer adding a minimal new file with a TODO at the top and wire it in, rather than large refactors. This keeps changes safe and reviewable.

