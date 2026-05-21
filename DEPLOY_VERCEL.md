# Deploying the frontend and admin to Vercel

This repository contains two Next.js apps:
- Public site at the repo root
- Admin app in `admin/`

Deploy them as two separate Vercel projects.

## 1) Public site

- Root directory: repository root
- Build command: `npm run build`
- Output: Next.js default
- Environment variables:
  - `NEXT_PUBLIC_API_BASE_URL` = your Render backend URL, for example `https://fitzone-backend.onrender.com`

## 2) Admin app

- Root directory: `admin`
- Build command: `npm run build`
- Output: Next.js default
- Environment variables:
  - `NEXT_PUBLIC_API_BASE_URL` = your Render backend URL, for example `https://fitzone-backend.onrender.com`

## Notes

- Do not set `DATABASE_URL` in Vercel.
- The backend must stay on Render (or another server) because it uses `pg` and server-side database access.
- If you change the backend URL later, update the Vercel environment variable in both projects.

## Quick checks after deploy

- Public site should load trainers/classes from the live API.
- Admin should show bookings/trainers/classes/messages from the live API.
