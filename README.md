# AgriTrade

AgriTrade is a React + Vite marketplace backed by Spring Boot and a relational database. It supports crop listings, user registration and sign-in, orders, dashboards, market data, and an AI assistant.

## Local development

Requirements: Node.js 22, Java 21, Maven 3.9+, and MySQL 8.

1. Copy `backend/.env.example` to `backend/.env` and set the local MySQL connection values.
2. Start the API from `backend` with `npm install` and `npm run dev`.
3. Start the frontend from `frontend` with `npm install` and `npm run dev`.
4. Open the Vite URL, usually `http://localhost:5173`.

The Vite development server proxies `/api` requests to `http://127.0.0.1:8080`.

## Deploy with Render and Netlify

The Render Blueprint in `render.yaml` creates a Spring Boot API and a free Render Postgres database. Render supplies the database credentials to the API without storing them in this repository. Initial production tables are created or updated by Hibernate. The free database expires 30 days after creation, and the free API spins down after 15 minutes without traffic.

1. Push this repository to GitHub and import it into Render as a Blueprint.
2. Choose the Singapore region and the free plan for the API and database. The free Render Postgres instance is limited to 1 GB and expires after 30 days.
3. Add an AI provider key in Render. Configure `APP_AI_API_KEY`, `APP_AI_MODEL`, and `APP_AI_BASE_URL` for the provider you use. AgriAI cannot call the local Ollama instance from Render.
4. Deploy the Netlify site from this repository. `netlify.toml` sets the Vite build and publish paths and points `VITE_API_URL` at `https://agritrade-neela-api.onrender.com/api`.
5. Use the Netlify production site URL and the Render API URL to check the site. `GET /api/health` reports API and database status.

If Render assigns a different API hostname, update `VITE_API_URL` in Netlify and redeploy. The API allows `*.netlify.app` origins and local Vite development by default.

## Database and environment variables

The backend reads `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD`. A complete `DB_URL` can override the generated PostgreSQL URL. Local Docker development can continue using MySQL. Never commit `.env` files or production credentials. Render generates `APP_JWT_SECRET` for the hosted API.

## API routes

- `POST /api/auth/register` and `POST /api/auth/login`
- `GET /api/crops` and `POST /api/crops`
- `GET /api/market-data`
- `POST /api/orders`, `GET /api/orders`, and `PUT /api/orders/{id}/status`
- `GET /api/health` checks database connectivity
- `GET /api/health/mongodb` checks the optional MongoDB connection

## Checks

```powershell
cd frontend
npm test
npm run lint
npm run build

cd ..\backend
mvn test
```
