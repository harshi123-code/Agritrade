<<<<<<< HEAD
# AgriTrade

A modular full-stack AgriTrade capstone starter built with React + Vite, Axios, React Router, Spring Boot, Spring Data JPA, Spring Security and MySQL.

## What works now

- Search public crop listings by crop or location and inspect listing details.
- Register and sign in as a farmer, buyer or logistics user. Passwords are BCrypt-hashed; login returns a JWT.
- Publish crop listings as a signed-in farmer.
- Place orders as a signed-in buyer; farmers can accept or reject an order. Requested stock is reserved and returned if rejected.
- Open a role-aware dashboard with real order counts and farmer responses.
- View dated crop prices and demand recorded in the Market Desk database table.
- Use layered controllers, DTO validation, services, repositories and JPA entities.

Market Desk displays stored dated price snapshots; it is not a real-time market feed. LLM-backed AgriAI, embeddings/vector search, document ingestion, logistics assignment, feedback, notifications, profile editing and production-grade role dashboards still need implementation and real providers/data. They are not simulated as working services.

## Requirements

- Node.js 20.19+ or 22.12+
- Java 21
- Maven 3.9+ (for the Nodemon development command)
- Docker Desktop with Docker Compose

## Run with Docker

1. Copy `.env.example` to `.env` and set `MYSQL_ROOT_PASSWORD` to the password for the MySQL container. Keep `.env` private; it is ignored by Docker build contexts.
2. Build and start the app from the project root:
   ```powershell
   docker compose up --build
   ```
3. Open http://localhost:5173. Sign in first, or choose “Join AgriTrade” to register. After successful login or registration, users go directly to their dashboard. The frontend serves the React app and forwards `/api` requests to Spring Boot. The backend connects to the Compose MySQL service on its private network.

The database is exposed to the host on port `3307` by default to avoid clashing with a local MySQL server already using `3306`. Change `MYSQL_HOST_PORT` in `.env` if needed. Spring Boot is also exposed on `http://localhost:8080` for direct API checks. AgriAI uses the local Ollama model `llama3.2:1b` by default; install Ollama and pull that model on the host first. For a cloud OpenAI-compatible provider, set `APP_AI_API_KEY`, `APP_AI_MODEL`, and `APP_AI_BASE_URL` in `.env`.

The container Compose database uses a persistent Docker volume. For a new empty local Compose database it creates schema `agritrade`; it does not automatically import SQL data from a separately installed MySQL instance.

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set the MySQL password. For local AgriAI, install Ollama and pull `llama3.2:1b`.
2. Start the backend with automatic restart when Java or configuration files change:
   ```powershell
   cd backend
   npm install
   npm run dev
   ```
   This runs the Spring Boot backend through Nodemon and loads settings from `backend/.env`. Keep `.env` private. You can also start the backend against your existing MySQL `agritrade` database with the password-prompt script:
   ```powershell
   .\run-local.ps1
   ```
   That script configures local MySQL and Ollama settings for the backend without saving the password.
3. Alternatively, to use the bundled Docker MySQL database instead of your existing local database, start it from the project root:
   ```powershell
   docker compose up -d
   ```
   The container uses host port `3307` so it does not conflict with a local MySQL server. Set the Compose `.env` values, then start the backend with its Docker service using `docker compose up --build`.
4. In another terminal, start the frontend:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
5. Open the Vite URL printed in the frontend terminal (usually http://localhost:5173). The sign-in page is the entry screen; new users can select “Join AgriTrade”. After authentication, users go directly to their dashboard.

The frontend sends `/api` requests through the Vite development proxy to `http://localhost:8080`. Set `VITE_API_URL` in a frontend `.env` file to override it. Backend connection settings can be overridden with `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`. Set `APP_JWT_SECRET` to a base64-encoded key of at least 32 bytes to keep tokens valid across backend restarts; without it, a random development-only key is generated at startup. Never use the local default database values in production.

MongoDB Atlas can be configured alongside the existing MySQL data store with `MONGO_URL`. Set it in `backend/.env` for local development or the project-root `.env` for Docker Compose. Use the Atlas connection string with the `agritrade` database path, replace the password placeholder with your URL-encoded database-user password, and add your current public IP to the Atlas project's Network Access list. After starting the backend, check `http://localhost:8080/api/health/mongodb`; an `UP` response confirms the connection.

## API

- `GET /api/crops` returns all crop listings.
- `POST /api/crops` creates a listing (FARMER role required). Example JSON:
  ```json
  { "cropName": "Basmati rice", "quantity": 500, "unit": "kg", "pricePerUnit": 42, "location": "Karnal, Haryana", "farmerName": "Asha Devi" }
  ```
- `POST /api/auth/register` and `POST /api/auth/login` handle authentication and return a bearer JWT.
- `GET /api/market-data` returns rows from `market_data`; values are dated snapshots, not real-time quotes.
- `POST /api/orders` places an order (BUYER role required); `GET /api/orders` returns the authenticated user's orders.
- `PUT /api/orders/{id}/status` lets the listing farmer accept or reject a new order.

Run frontend checks with `cd frontend; npm test; npm run lint; npm run build`. Run backend tests with `cd backend; .\mvnw.cmd test`.
=======
# Agritrade
Java FullStack WebDevelopment
>>>>>>> da78c0bfa996800a52b8797181aa839392245794
