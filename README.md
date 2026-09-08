# Saraswati Educational & Charitable Trust (SECT) Web Application

SECT is a web application and management system for the Saraswati Educational & Charitable Trust, supporting education, renewable energy, environmental protection, sustainable livelihoods, agriculture, solid-waste management, and community welfare.

The Trust operates in education, renewable energy, environmental protection, energy conservation, sustainable livelihoods, agriculture, solid-waste management, and community welfare.

---

## Repository Structure

As defined in `ANTIGRAVITY_TEAM_RULES.md`, the repository follows a multi-developer ownership model across 3 developers:

```text
SECT/
├── frontend/           # React + Vite client application
├── backend/            # Node.js + Express REST API
├── database/           # PostgreSQL migrations and seeds
├── docs/               # API and database documentation
├── tests/              # Backend tests
├── ANTIGRAVITY_TEAM_RULES.md
├── suchitra-backend-plan.md
└── mrinmayee-frontend-plan.md
```

## Frontend Setup

Prerequisites: Node.js 18+ and npm 9+.

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The Vite development server runs at `http://localhost:3000/` when configured by `vite.config.js`. Build with `npm run build`.

## Backend Setup

Prerequisites: Node.js 18+ and PostgreSQL 14+.

```bash
cd backend
npm install
cp .env.example .env
```

Update the database credentials and secret keys in `.env`, then run migrations and seeds:

```bash
npm run migrate:seed
npm run dev
```

The API is available at `http://localhost:5000/api/v1`.

## Team Ownership

- **Suchitra:** Backend API, PostgreSQL database, JWT authentication, RBAC, payments, webhooks, and 80G receipts.
- **Mrinmayee:** React frontend, public and admin UI, API integration, and donation flow.
- **Developer 3:** QA, DevOps, CI/CD, and deployment.

---

## 2. Backend Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

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
Update your database credentials and secret keys in `.env`.

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
