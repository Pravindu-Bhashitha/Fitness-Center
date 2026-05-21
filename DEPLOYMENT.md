# Low-Cost Deployment Plan

This branch is prepared for a low-cost deployment setup:

- Frontend: Vercel free or Pro
- Admin app: Vercel free or Pro
- Backend API: Render, Railway, or any small Node host
- Database: Neon or Supabase Postgres

## Environment variables

Backend:

- `DATABASE_URL` - PostgreSQL connection string
- `PGSSL=true` - enable SSL for hosted Postgres
- `PORT=4000` - backend port
- `CORS_ORIGIN` - comma-separated allowed frontend origins

Frontend/admin:

- `NEXT_PUBLIC_API_BASE_URL` - backend base URL, for example `http://localhost:4000` locally or your deployed API URL in production

## Local dev

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
npm install
npm run dev
```

Admin:

```bash
cd admin
npm install
npm run dev
```
