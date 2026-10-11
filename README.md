# AgriTrade

AgriTrade is a React + Vite marketplace backed by Spring Boot and MySQL. It supports crop listings, user registration and sign-in, orders, dashboards, market data, and an AI assistant.

## Local development

Requirements: Node.js 22, Java 21, Maven 3.9+, and MySQL 8.

1. Copy `backend/.env.example` to `backend/.env` and set the local MySQL connection values.
2. Start the API from `backend` with `npm install` and `npm run dev`.
3. Start the frontend from `frontend` with `npm install` and `npm run dev`.
4. Open the Vite URL, usually `http://localhost:5173`.

The Vite development server proxies `/api` requests to `http://127.0.0.1:8080`.

## Deploy with Render and Netlify

The Render Blueprint in `render.yaml` creates a Spring Boot API and a private MySQL 8 service with a persistent disk. The MySQL service uses generated credentials; the Blueprint passes them to the API without storing them in this repository. Initial production tables are created or updated by Hibernate.

1. Push this repository to GitHub and import it into Render as a Blueprint.
2. Choose the Singapore region. Render requires a paid private service and persistent disk for the MySQL instance; confirm the plan and disk cost shown in Render before creating the resources.
3. Add an AI provider key in Render. Configure `APP_AI_API_KEY`, `APP_AI_MODEL`, and `APP_AI_BASE_URL` for the provider you use. AgriAI cannot call the local Ollama instance from Render.
4. Deploy the Netlify site from this repository. `netlify.toml` sets the Vite build and publish paths and points `VITE_API_URL` at `https://agritrade-neela-api.onrender.com/api`.
5. Use the Netlify production site URL and the Render API URL to check the site. `GET /api/health` reports API and MySQL status.

If Render assigns a different API hostname, update `VITE_API_URL` in Netlify and redeploy. The API allows `*.netlify.app` origins and local Vite development by default.

## Database and environment variables

The backend reads `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD`. A complete `DB_URL` can override the generated MySQL URL. Never commit `.env` files or production credentials. Render generates `APP_JWT_SECRET` for the hosted API.

## API routes

- `POST /api/auth/register` and `POST /api/auth/login`
- `GET /api/crops` and `POST /api/crops`
- `GET /api/market-data`
- `POST /api/orders`, `GET /api/orders`, and `PUT /api/orders/{id}/status`
- `GET /api/health` checks MySQL connectivity
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
