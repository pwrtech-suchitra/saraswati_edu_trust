# Saraswati Educational & Charitable Trust (SECT) Web Application

SECT is a web application and management system for the Saraswati Educational & Charitable Trust, supporting education, renewable energy, environmental protection, sustainable livelihoods, agriculture, solid-waste management, and community welfare.

The Trust operates in education, renewable energy, environmental protection, energy conservation, sustainable livelihoods, agriculture, solid-waste management, and community welfare.

---

## Repository Structure

As defined in `ANTIGRAVITY_TEAM_RULES.md`, the repository follows a multi-developer ownership model across 3 developers:

```text
SECT/
├── frontend/           # React single-page application, built with Webpack
├── backend/            # Node.js + Express REST API
├── database/           # PostgreSQL migrations and seeds
├── docs/               # API and database documentation
├── tests/              # Backend tests
├── ANTIGRAVITY_TEAM_RULES.md
├── suchitra-backend-plan.md
└── mrinmayee-frontend-plan.md
```

## Frontend Setup

Prerequisites: Node.js 20.19+ (or 22.12+) and npm.

Install each application's dependencies, then run the frontend and API together from the repository root:

```bash
npm --prefix backend install
npm --prefix frontend install
npm install
npm run dev
```

The frontend is available at `http://localhost:3000/` and the API at `http://localhost:5000/api/v1`.

Run either side independently with `npm run dev:frontend` or `npm run dev:backend`. The root `npm start` starts only the production API; the production frontend is a static build served by Nginx in the Docker Compose deployment.

```bash
npm run build:frontend
npm start
```

To build the production frontend locally, run `npm run build:frontend`. The generated static files are served by Nginx in the production Docker Compose deployment.

## Backend Setup

Prerequisites: Node.js 20.19+ (or 22.12+). PostgreSQL 14+ is required for production. Local development and tests can use
persistent PGlite storage; production fails closed instead of silently switching
databases.

```bash
cd backend
npm install
cp .env.example .env
```

Update the database credentials and secret keys in `.env`, then run migrations and development seeds:

```bash
npm run migrate:seed
npm run dev
```

Seed fixtures are inserted only when their target tables are empty. Existing project,
news, event, document, trust-profile, and donation data is preserved; rerunning the
seed command skips fixture scripts for tables that already contain records.

For local development, PostgreSQL credentials are only needed when connecting to an
external instance; set `USE_EMBEDDED_DB=true` to explicitly use local PGlite storage.
Production requires separate runtime/migration PostgreSQL URLs, distinct high-entropy
JWT secrets, and an HTTPS `FRONTEND_URL`. Donors report UPI references; an admin must
verify bank records before the application marks a donation complete or issues a receipt.
The API refuses to start
when required production settings are absent or contain example placeholders. Database
TLS certificate validation is enabled in production; set `DATABASE_SSL_CA` when the
database provider requires a custom CA certificate.

Do not run `npm run migrate:seed` against production; it contains demonstration
content. Apply schema changes with `npm run migrate --prefix backend`, then run
`npm run admin:create --prefix backend` once with `NODE_ENV=production`,
`BOOTSTRAP_ADMIN_EMAIL`, and a unique `BOOTSTRAP_ADMIN_PASSWORD` (at least 16
characters with uppercase, lowercase, a number, and a symbol). The command refuses
to elevate an existing account. Remove the bootstrap password from the deployment
environment after it completes.

Email delivery is not currently configured: the application stores inquiries and
donations, but it does not send receipt or inquiry-notification email. Choose and
configure an email provider before advertising email delivery to donors.

## Continuous Integration

GitHub Actions runs the backend test suite, frontend lint, and frontend production
build for every push and pull request. Run the same checks locally with:

```bash
npm test
npm run lint:frontend
npm run build:frontend
```

## Production Deployment

The repository includes Railway service Dockerfiles and a Docker Compose deployment; see the release runbook in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Production needs a TLS-enabled managed PostgreSQL database, separate application/migration roles, persistent upload-volume backups, and an approved donation workflow.

The API is available at `http://localhost:5000/api/v1`.

## Team Ownership

- **Suchitra:** Backend API, PostgreSQL database, JWT authentication, RBAC, payments, webhooks, and 80G receipts.
- **Mrinmayee:** React frontend, public and admin UI, API integration, and donation flow.
- **Developer 3:** QA, DevOps, CI/CD, and deployment.

---

## 2. Backend Getting Started

### Prerequisites
- Node.js (v20.19+ or v22.12+)
- PostgreSQL (v14+) when using an external database; PGlite is available for local use

### Installation
```bash
cd backend
npm install
```

### Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Update your database credentials and secret keys in `.env`. PostgreSQL credentials are
only needed when connecting to an external instance; set `USE_EMBEDDED_DB=true` to
explicitly use local PGlite storage.

### Database Migrations
Run the database migrations and seed scripts:
```bash
npm run migrate:seed
```

### Running the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

API will be available at `http://localhost:5000/api/v1`.

### Running Tests
```bash
npm test
```

---

## Documentation
- [API Contract](docs/API.md): Detailed REST endpoints, request/response schemas, and status codes.
- [Database Specification](docs/DATABASE.md): PostgreSQL schemas, table definitions, and constraints.
- [Team Rules](ANTIGRAVITY_TEAM_RULES.md): Antigravity team guidelines and role boundaries.
