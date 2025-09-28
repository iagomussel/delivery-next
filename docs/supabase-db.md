# Supabase as Postgres (Prisma)

This project uses Prisma and connects directly to Supabase Postgres. No Supabase Auth or Storage is used.

## Setup

- In Supabase Dashboard → Project Settings → Database, copy the connection string.
- Prefer the Pooler (port 6543) for Prisma and add options:
  - `?pgbouncer=true&sslmode=require&connection_limit=1`
- Set `DATABASE_URL` (pooled) and `DIRECT_DATABASE_URL` (direct) in `.env`. See `env.example`.
- If your password contains special characters, percent‑encode it (MDN: https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding).
  - Quick helper: `node -e "console.log(encodeURIComponent(process.argv[1]))" "RAW_PASSWORD"`

Example (replace YOUR_PROJECT_REF/YOUR_PASSWORD and region):

```
DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:ENCODED_PASSWORD@aws-1-YOUR_REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require&connection_limit=1"
DIRECT_DATABASE_URL="postgresql://postgres:ENCODED_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
```

## Migrate schema

- Generate client: `npx prisma generate`
- Push schema (creates tables): `npx prisma db push`

If you prefer migrations, use `npx prisma migrate dev` instead.

## Notes

- Decimals map to `numeric` in Postgres. API responses already convert Prisma `Decimal` to JS `Number` where appropriate.
- Auth remains the lightweight JWT implementation in `src/lib/auth.ts`.
- You don’t need Supabase JS SDK since we only use Postgres.
