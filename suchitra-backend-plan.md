# SECT Project — Suchitra's Implementation Plan (Backend & Database)

**Developer:** Suchitra  
**Role:** Backend Developer & Database Architect  
**Workspace:** `c:\Users\Suchitra Mishra\Desktop\SECT\`  
**Reference Documents:** `ANTIGRAVITY_TEAM_RULES.md` & `mrinmayee-frontend-plan.md`  

---

## 1. Role Boundary & Mandate Verification

As defined in `ANTIGRAVITY_TEAM_RULES.md` (Sections 4, 7, 9, 10, 20, 30 & 31):

### What Suchitra OWNS:
- **`backend/`**: Node.js + Express REST API application architecture, routes, middleware, controllers, services, repositories.
- **`database/`**: PostgreSQL schema design, migrations, seeders, connection pool, referential integrity, constraints, indexes.
- **Security**: JWT auth (access + refresh), password hashing (bcrypt), RBAC middleware, rate limiting, security headers (Helmet), input sanitization.
- **Business Modules (Backend)**:
  - Authentication & RBAC (Users, Roles, Permissions)
  - Projects & Categories APIs (with soft-delete support to preserve donation history)
  - News, Events, and Event Registrations APIs
  - Media & Document Management APIs (with secure Multer file upload handling)
  - Contact & Inquiry APIs + Volunteer Applications
  - Donation & Payment Gateway Backend (Order creation, Verification, Idempotent Webhook processing)
  - Admin & Reporting APIs (Metrics, 80G tax receipt data generation, Audit logs)
  - System Health Check API (`GET /api/v1/health`) for DevOps/Developer 3 monitoring
- **Documentation Contracts**:
  - `docs/API.md`: Standard REST contract, request/response payloads, status codes.
  - `docs/DATABASE.md`: Schema definition, table relationships, constraints, indexes.
- **Testing**: Backend unit & integration test suites (`tests/backend/`).

### What Suchitra MUST NOT Touch:
- **`frontend/`**: React pages, components, CSS/Tailwind styling, client-side routing (Owned exclusively by **Mrinmayee**).
- **`deployment/` & DevOps**: Staging/production infrastructure, CI/CD pipelines (Owned by **Developer 3**).

---

## 2. Standard Backend Architecture (`backend/`)

Every feature will strictly follow the layered flow:
```text
HTTP Request
     ↓
Route (`routes/`)
     ↓
Security / Auth Middleware (`middleware/auth.js`, `middleware/rbac.js`)
     ↓
Upload Middleware (`middleware/upload.js` for multipart file uploads)
     ↓
Input Validation (`middleware/validate.js` + `validations/`)
     ↓
Controller (`controllers/`) — Handles req/res, HTTP status codes
     ↓
Service (`services/`) — Business logic, payment calculations, transactions
     ↓
Database Layer (`models/` or `db/queries/`) — Parameterized PostgreSQL queries
     ↓
Standard API Response (`utils/apiResponse.js`)
```

### Standard Response Format (Section 12 Compliant):
```json
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": {}
}

// Error
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

---

## 3. Directory & File Structure to Build

```text
c:\Users\Suchitra Mishra\Desktop\SECT\
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # PostgreSQL pg.Pool configuration & query helper
│   │   │   ├── env.js                # Validated environment variable loader (dotenv/zod)
│   │   │   └── logger.js             # Logging utility (Morgan / Winston)
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, Login, Refresh, Logout, Profile
│   │   │   ├── projectController.js  # Projects & Categories CRUD, Category filter, Stats
│   │   │   ├── donationController.js # Donations, Donor history, 80G Receipts
│   │   │   ├── paymentController.js  # Order creation, Verify signature, Webhooks
│   │   │   ├── newsEventController.js# News, Events & Event Registration
│   │   │   ├── mediaController.js    # Gallery, document metadata & secure file uploads
│   │   │   ├── contactController.js  # Inquiries & Volunteer application submission
│   │   │   ├── adminController.js    # Admin user management & overview stats
│   │   │   ├── reportController.js   # Donation summary & 80G tax reports
│   │   │   └── healthController.js   # Health check endpoint for DevOps/Developer 3
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification & token extraction
│   │   │   ├── rbac.js               # Role and permission enforcement
│   │   │   ├── validate.js           # Request validation middleware
│   │   │   ├── upload.js             # Multer middleware for images & PDF documents
│   │   │   ├── rateLimiter.js        # IP rate limiting for auth & payments
│   │   │   ├── security.js           # Helmet, CORS configuration (Mrinmayee's Vite origin)
│   │   │   └── errorHandler.js       # Centralized error handler
│   │   ├── routes/
│   │   │   ├── index.js              # Main API router (/api/v1)
│   │   │   ├── authRoutes.js         # /api/v1/auth
│   │   │   ├── projectRoutes.js      # /api/v1/projects & /api/v1/categories
│   │   │   ├── donationRoutes.js     # /api/v1/donations
│   │   │   ├── paymentRoutes.js      # /api/v1/payments & webhooks
│   │   │   ├── newsRoutes.js         # /api/v1/news
│   │   │   ├── eventRoutes.js        # /api/v1/events & registrations
│   │   │   ├── mediaRoutes.js        # /api/v1/media & documents
│   │   │   ├── contactRoutes.js      # /api/v1/contact & /api/v1/volunteers
│   │   │   ├── adminRoutes.js        # /api/v1/admin
│   │   │   ├── reportRoutes.js       # /api/v1/reports
│   │   │   └── healthRoutes.js       # /api/v1/health
│   │   ├── services/
│   │   │   ├── authService.js        # Token generation, password hashing
│   │   │   ├── projectService.js     # Project data processing & soft-deletes
│   │   │   ├── donationService.js    # Donation calculation & DB records
│   │   │   ├── paymentService.js     # Gateway integration (Razorpay/Stripe)
│   │   │   ├── webhookService.js     # Idempotent webhook verification & DB transactions
│   │   │   ├── receiptService.js     # 80G receipt sequence number & certificate payload
│   │   │   ├── emailService.js       # Notification & receipt email dispatcher
│   │   │   └── auditService.js       # Audit logging service
│   │   ├── validations/
│   │   │   ├── authValidation.js     # Validation schemas for auth
│   │   │   ├── projectValidation.js  # Project & category schemas
│   │   │   ├── donationValidation.js # Donation & payment verification schemas
│   │   │   ├── eventValidation.js    # Event registration schemas
│   │   │   └── contactValidation.js  # Inquiry & volunteer schemas
│   │   ├── utils/
│   │   │   ├── apiResponse.js        # Standardized API response builder
│   │   │   ├── constants.js          # Roles, permissions, payment statuses
│   │   │   └── signatureHelper.js    # Webhook HMAC-SHA256 signature verifier
│   │   ├── uploads/                  # Local storage directory for media & documents
│   │   ├── app.js                    # Express app configuration & middleware
│   │   └── server.js                 # Server entry point & DB connection check
│   ├── .env.example                  # Environment configuration template
│   ├── .gitignore                    # Node.js specific gitignore (ignores /uploads)
│   └── package.json                  # Backend dependencies & scripts
│
├── database/
│   ├── migrations/
│   │   ├── 001_create_users_and_roles.sql
│   │   ├── 002_create_projects_and_categories.sql
│   │   ├── 003_create_news_and_events.sql
│   │   ├── 004_create_gallery_and_documents.sql
│   │   ├── 005_create_donations_and_payments.sql
│   │   ├── 006_create_inquiries_and_volunteers.sql
│   │   └── 007_create_audit_logs.sql
│   ├── seeds/
│   │   ├── 001_roles_and_permissions_seed.sql
│   │   ├── 002_admin_user_seed.sql
│   │   └── 003_initial_categories_seed.sql
│   └── migrate.js                    # Standalone SQL migration runner utility
│
├── docs/
│   ├── API.md                        # Complete API contract for Mrinmayee
│   └── DATABASE.md                   # PostgreSQL schema documentation & ERD
│
└── tests/backend/
    ├── auth.test.js                  # Authentication & RBAC tests
    ├── projects.test.js              # Projects endpoint tests
    ├── donations.test.js             # Donation & payment verification tests
    ├── webhook.test.js               # Idempotency & signature tests
    └── health.test.js                # Health check test
```

---

## 4. Key Endpoints Specification (Contract with Mrinmayee & Developer 3)

| Domain | Method | Endpoint | Access | Notes |
|---|---|---|---|---|
| **System** | `GET` | `/api/v1/health` | Public | Database ping & uptime status for Developer 3 |
| **Auth** | `POST` | `/api/v1/auth/register` | Public | Register donor/user account |
| **Auth** | `POST` | `/api/v1/auth/login` | Public | Returns access & refresh tokens |
| **Auth** | `POST` | `/api/v1/auth/refresh` | Public | Refresh expired access token |
| **Auth** | `POST` | `/api/v1/auth/logout` | Authenticated | Invalidate refresh token |
| **Auth** | `GET` | `/api/v1/auth/profile` | Authenticated | Get current user details & role |
| **Projects** | `GET` | `/api/v1/projects` | Public | Supports `?category=`, `?search=`, `?page=`, `?limit=` |
| **Projects** | `GET` | `/api/v1/projects/:id` | Public | Project details with images & funding status |
| **Projects** | `POST` | `/api/v1/projects` | Admin/Staff | Create project (with image upload) |
| **Projects** | `PUT` | `/api/v1/projects/:id` | Admin/Staff | Update project |
| **Projects** | `DELETE`| `/api/v1/projects/:id` | Admin | Soft-delete (preserves donation integrity) |
| **Categories**| `GET` | `/api/v1/categories` | Public | List categories (Education, Solar, Waste, etc.) |
| **News** | `GET` | `/api/v1/news` | Public | List published articles with pagination |
| **Events** | `GET` | `/api/v1/events` | Public | List upcoming/past events |
| **Events** | `POST` | `/api/v1/events/:id/register` | Public | User/guest event registration |
| **Media** | `GET` | `/api/v1/media` | Public | Gallery images & videos |
| **Media** | `POST` | `/api/v1/media/upload` | Admin/Staff | Multipart image upload via Multer |
| **Documents**| `GET` | `/api/v1/documents` | Public | Annual reports, audit statements, policies |
| **Contact** | `POST` | `/api/v1/contact` | Public | Submit contact inquiry |
| **Volunteer**| `POST` | `/api/v1/volunteers` | Public | Submit volunteer application |
| **Donations**| `POST` | `/api/v1/donations/create-order` | Public | Creates gateway order (`amount`, `currency`, `order_id`) |
| **Donations**| `POST` | `/api/v1/donations/verify` | Public | HMAC signature verification & DB transaction |
| **Donations**| `GET` | `/api/v1/donations/my-donations`| Authenticated | Donor's past donation list |
| **Donations**| `GET` | `/api/v1/donations/:id/receipt` | Authenticated | 80G receipt voucher data / download |
| **Payment** | `POST` | `/api/v1/payments/webhook` | Gateway Only | Authoritative, idempotent webhook handler |
| **Admin** | `GET` | `/api/v1/admin/stats` | Admin | Overall metrics (funds, donors, projects, inbox) |
| **Admin** | `GET` | `/api/v1/admin/users` | Admin | User list with role filtering |
| **Admin** | `PATCH`| `/api/v1/admin/users/:id/role`| Admin | Assign/modify user roles |
| **Reports** | `GET` | `/api/v1/reports/donations` | Admin | Filtered financial reports |
| **Reports** | `GET` | `/api/v1/reports/80g` | Admin | Donor PAN & address dataset for tax compliance |

---

## 5. Phased Implementation Roadmap

### Phase 1: Foundation & Infrastructure (Suchitra)
1. **Initialize Backend Environment**:
   - `backend/package.json` with dependencies:
     - Core: `express`, `pg`, `dotenv`, `cors`, `helmet`, `morgan`
     - Auth: `bcryptjs`, `jsonwebtoken`
     - Security: `express-rate-limit`
     - Validation: `zod`
     - File Uploads: `multer`
   - Setup `.env.example` including:
     - `PORT=5000`
     - `DATABASE_URL=postgres://user:password@localhost:5432/sect_db`
     - `JWT_SECRET`, `JWT_REFRESH_SECRET`
     - `PAYMENT_KEY_ID`, `PAYMENT_KEY_SECRET`, `PAYMENT_WEBHOOK_SECRET`
     - `FRONTEND_URL=http://localhost:3000` (Mrinmayee's Vite dev server)
     - `UPLOAD_DIR=./uploads`
   - Configure PostgreSQL client pool in `backend/src/config/db.js`.
2. **Database Core Migrations**:
   - `001_create_users_and_roles.sql`: `users`, `roles`, `permissions`, `user_roles`, `role_permissions`.
   - Seed default roles (`ADMIN`, `STAFF`, `MEMBER`, `DONOR`, `VOLUNTEER`) & initial admin user.
   - Write standalone migration runner `database/migrate.js`.
3. **Core Middleware & Security**:
   - Centralized error handler (`middleware/errorHandler.js`).
   - Rate limiters (`middleware/rateLimiter.js`).
   - Standard response formatting (`utils/apiResponse.js`).
   - Health check endpoint (`GET /api/v1/health`).
4. **Authentication & RBAC**:
   - Register, login, refresh token, change password, profile endpoints.
   - JWT generation, password hashing with bcrypt.
   - `middleware/auth.js` and `middleware/rbac.js`.
5. **Phase 1 Contracts**:
   - Provide initial `docs/API.md` and `docs/DATABASE.md` so Mrinmayee can connect auth.

### Phase 2: Core NGO Management Modules (Suchitra)
1. **Projects & Focus Areas**:
   - Schema: `categories`, `projects` (with `is_deleted` soft-delete), `project_updates`, `project_images`.
   - Controller & routes for public listing, single project detail, admin CRUD.
2. **News & Events**:
   - Schema: `news_articles`, `events`, `event_registrations`.
   - Controller & routes: upcoming events, past events, published news articles, event registration.
3. **Gallery, Documents & File Uploads**:
   - Schema: `media_files`, `documents` (annual reports, policies, compliance docs).
   - `middleware/upload.js` using Multer with file type filtering (JPEG/PNG/WebP for images, PDF for docs).
   - Controller & routes with category filters.
4. **Contact & Volunteer Inquiries**:
   - Schema: `inquiries` and `volunteer_applications`.
   - Controller & routes for submitting inquiries/volunteer forms and admin management.
5. **Update Contracts**:
   - Update `docs/API.md` with pagination, filter query params, and sample payloads.

### Phase 3: Donation System & Payment Gateway Integration (Suchitra)
1. **Donation Schema (`database/migrations/005_create_donations_and_payments.sql`)**:
   - Tables: `donations`, `payment_orders`, `payment_transactions`, `donation_receipts`.
   - Constraints: Enums for status (`PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`), foreign keys, audit timestamps.
2. **Payment Gateway Integration**:
   - Server-side order creation (`POST /api/v1/donations/create-order`).
   - Secure verification endpoint (`POST /api/v1/donations/verify`) using HMAC-SHA256 signature check.
   - Authoritative Webhook endpoint (`POST /api/v1/payments/webhook`):
     - Signature verification using webhook secret.
     - **Idempotency**: Prevent duplicate processing via webhook transaction reference caching.
     - Atomic PostgreSQL transaction updating donation status and recording transaction details.
3. **Receipt & Tax Data (80G)**:
   - `services/receiptService.js`: Unique receipt sequence generator (`SECT/YYYY-YY/XXXXX`), Trust 80G registration info, donor PAN.
   - Endpoint: `GET /api/v1/donations/:id/receipt`.

### Phase 4: Admin Management, Reporting & Audit Logs (Suchitra)
1. **Audit Logs (`database/migrations/007_create_audit_logs.sql`)**:
   - Audit trail table: `user_id`, `action`, `entity_name`, `entity_id`, `old_values`, `new_values`, `ip_address`, `timestamp`.
   - `services/auditService.js` to log all administrative and financial mutations.
2. **Admin & Analytics APIs**:
   - Metrics: Total donations collected, donor count, active projects, pending inquiries.
   - User Management APIs: List users, assign roles, toggle user status.
3. **Reports API**:
   - Filtered donation reports (date range, project, payment status).
   - Export-ready data formats (JSON summary with donor PAN/address for 80G certificate generation).

---

## 6. Security & Verification Strategy

1. **Security Guardrails**:
   - Never commit secrets; all credentials loaded via `.env`.
   - Parameterized SQL queries on all pg queries (zero raw SQL string interpolation).
   - CORS strictly configured to allow frontend origin (`FRONTEND_URL`).
   - Rate limiting on sensitive endpoints (`/api/v1/auth/*`, `/api/v1/payments/*`).
   - File upload validation: File size limits (max 5MB for images, 10MB for PDFs) and MIME-type sniffing.
2. **Automated & Manual Verification**:
   - Node.js syntax & startup verification: `node backend/src/server.js`.
   - Database schema migration dry-run and validation.
   - Automated API tests using Supertest/Jest in `tests/backend/`.
   - Contract verification against `mrinmayee-frontend-plan.md`.
