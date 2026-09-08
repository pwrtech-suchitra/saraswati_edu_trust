# Saraswati Educational & Charitable Trust (SECT) Web Application

Web application and management system for the Saraswati Educational & Charitable Trust (SECT).

The Trust operates in education, renewable energy, environmental protection, energy conservation, sustainable livelihoods, agriculture, solid-waste management, and community welfare.

---

## 1. Repository Architecture & Ownership

As defined in `ANTIGRAVITY_TEAM_RULES.md`, the repository follows a multi-developer ownership model across 3 developers:

```text
SECT/
├── backend/            # [Suchitra] Node.js, Express REST API, auth & payment services
├── database/           # [Suchitra] PostgreSQL migrations, seeds & runner
├── docs/               # [Shared] API contracts, Database docs, Architecture
├── tests/              # [Suchitra & Developer 3] Unit, integration & security tests
├── ANTIGRAVITY_TEAM_RULES.md
├── suchitra-backend-plan.md
└── mrinmayee-frontend-plan.md
```

### Team Responsibilities
- **Suchitra (Developer 1)**: Backend API, PostgreSQL database, JWT authentication, RBAC, payment gateway integration, webhooks, 80G tax receipts.
- **Mrinmayee (Developer 2)**: React frontend application, public UI, admin UI, client-side API integration.
- **Developer 3**: QA, DevOps, CI/CD, and deployment.

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

## 3. Documentation
- [API Contract](docs/API.md): Detailed REST endpoints, request/response schemas, and status codes.
- [Database Specification](docs/DATABASE.md): PostgreSQL schemas, table definitions, and constraints.
- [Team Rules](ANTIGRAVITY_TEAM_RULES.md): Antigravity team guidelines and role boundaries.
