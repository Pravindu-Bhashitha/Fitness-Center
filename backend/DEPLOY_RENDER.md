# Deploy backend to Render

This file shows steps to deploy the `backend` folder as a Render Web Service. The repo includes `render.yaml` manifest to automate creation.

1. Sign in to Render (https://dashboard.render.com).
2. Create a new "Web Service" and select "Connect a repository". Choose this repository and the `low-cost-deploy` branch.
3. If you want to use the `render.yaml`, choose "Use render.yaml" when creating the service — Render will create the `fitzone-backend` service from `backend/render.yaml`.

Environment variables (add these in Render Dashboard -> Service -> Environment):
- `DATABASE_URL` = paste your Supabase connection string (postgresql://...)
- `PGSSL` = `true`
- `PORT` = `4000` (optional; defaults typically to 10000 on Render — ensure your server reads `process.env.PORT`)

Build & Start commands:
- Build: `npm install && npm run build`
- Start: `npm run start`

Notes:
- Ensure `backend/package.json` includes `build` and `start` scripts. Example:
  - `"build": "tsc -p ."`
  - `"start": "node dist/server.js"`

Health check: `GET /health` should respond 200. Add a route in `backend/src/server.ts` if missing:

```js
app.get('/health', (_req, res) => res.send('ok'));
```

After deploy, copy the generated service URL and set it as `NEXT_PUBLIC_API_BASE_URL` in Vercel for both frontend and admin.
