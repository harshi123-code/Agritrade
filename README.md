# AgriTrade

AgriTrade is a React + Vite marketplace backed by Spring Boot and a relational database. It supports crop listings, user registration and sign-in, orders, dashboards, market data, and an AI assistant.

## Local development

Requirements: Node.js 22, Java 21, Maven 3.9+, and MySQL 8.

1. Copy `backend/.env.example` to `backend/.env` and set the local MySQL connection values.
2. Start the API from `backend` with `npm install` and `npm run dev`.
3. Start the frontend from `frontend` with `npm install` and `npm run dev`.
4. Open the Vite URL, usually `http://localhost:5173`.

The Vite development server proxies `/api` requests to `http://127.0.0.1:8080`.

## Local configuration

<<<<<<< HEAD
The backend reads `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`; the example environment file configures local MySQL. Keep `.env` files and database credentials private. Set `APP_CORS_ALLOWED_ORIGINS` to the frontend origin when running the app from a different local address.
=======
The backend reads `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`; the example environment file configures local MySQL. Keep `.env` files and database credentials private. Set `APP_CORS_ALLOWED_ORIGINS` to the frontend origin when running the app from a different local address.
>>>>>>> 6afb91dae240b29a22cb8633a3499655b31bdbf3

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
