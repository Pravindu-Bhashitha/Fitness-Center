# Deploying FitZone (Supabase + Render) — Low-cost guide

This guide walks through deploying the backend to Render and the frontend/admin to Vercel, while moving your local SQLite data into a managed Postgres (Supabase). It keeps costs minimal (Supabase has a free tier; Render has a free or low-cost plan).

Overview:
- Create a Supabase project (free tier) — get `DATABASE_URL`.
- Create a Render Web Service for the backend (free/cheap) — set `DATABASE_URL`, `PGSSL=true`.
- Deploy frontend/admin to Vercel and set `NEXT_PUBLIC_API_BASE_URL` to the Render service URL.

Migration script (local):
- Use the included `tools/migrate-sqlite-to-postgres.ps1` to read `backend/data/bookings.v2.sqlite` and insert rows into Supabase.

Notes:
- Supabase projects on free tier provide persistent Postgres and a connection string. Use `PGSSL=true` when connecting from Render.
- Alternatively use Neon (also has free tier) — the `DATABASE_URL` format is the same.

Next steps:
1. Create Supabase project and database. Keep the connection string handy.
2. Create Render service pointing to `backend/` directory. Add environment variables: `DATABASE_URL`, `PGSSL=true`, `PORT=4000`.
3. Deploy Vercel for frontend and admin. Set `NEXT_PUBLIC_API_BASE_URL` to your Render service URL.

Migration helper scripts are in `tools/`.
