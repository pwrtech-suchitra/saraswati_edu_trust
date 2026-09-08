# SECT Web Application — Antigravity Team Development Rules

**Project:** Saraswati Educational & Charitable Trust (SECT) Web Application  
**Architecture:** React + Node.js/Express + PostgreSQL + Payment Gateway  
**Development Model:** 3 developers, 3 devices, 3 separate IDE/Antigravity environments  
**Shared Instruction File:** This file must be kept in the common project repository and read by every developer's Antigravity agent.

---

## 1. Purpose of This File

This file is the **single source of truth for team task boundaries and development rules**.

Every developer is using a separate device and separate IDE/Antigravity environment. Therefore:

- Antigravity must work **only on the tasks assigned to its developer**.
- Antigravity must not modify another developer's module without explicit team approval.
- Shared interfaces such as API contracts, database contracts, environment variables and folder structure must be respected.
- Before creating new architecture, Antigravity must check this document and the existing code.
- Do not duplicate functionality already assigned to another developer.
- Do not rewrite another developer's code merely to improve style.
- Changes must remain compatible with the shared architecture.

---

# 2. Project Goal

Build a secure, scalable web application for Saraswati Educational & Charitable Trust (SECT).

The Trust works in areas including charity, social service, education, renewable energy, environmental protection, energy conservation, sustainable livelihood, agriculture, solid-waste management, community development and government-resource mobilization.

The application will provide:

- Public SECT website
- About, Mission and Vision
- Activities and sustainability information
- Project management
- News and events
- Gallery and documents
- Donation/payment system
- Admin panel
- User and role management
- Reports
- Contact/inquiry management
- Future volunteer/beneficiary/project-impact features

---

# 3. Technology Stack

## Frontend

- React.js
- React Router
- Axios
- Tailwind CSS or the approved UI library
- React Hook Form
- Zod/Yup where required

## Backend

- Node.js
- Express.js
- REST API
- JWT-based authentication
- Role-Based Access Control
- Request validation
- Rate limiting
- Security headers
- Centralized error handling
- Logging

## Database

- PostgreSQL
- Database migrations
- Foreign keys
- Indexes
- Transactions
- Constraints
- Audit fields

## Payment

Use the payment gateway selected by the project team.

**Critical rule:** frontend payment success must never be treated as final payment confirmation. Backend verification/webhook processing is authoritative.

---

# 4. Team Structure

## Developer 1 — Suchitra

### Primary Role
**Backend Developer + Database Developer**

### Owns

- Node.js backend
- Express API
- PostgreSQL database
- Database schema
- Migrations
- Authentication backend
- Authorization/RBAC backend
- Project APIs
- Donation APIs
- Payment gateway backend integration
- Webhooks
- File/document backend services
- Admin backend APIs
- Reports backend
- Audit logs
- Backend security
- Backend testing

### Must NOT own

- React page implementation
- React component styling
- Frontend routing implementation
- Frontend UI redesign

### Can coordinate with Mrinmayee on

- API contracts
- Request/response formats
- Authentication flow
- API error formats
- Pagination/filtering
- Payment response format

---

# 5. Developer 2 — Mrinmayee

### Primary Role
**Frontend Developer + API Integration**

### Owns

- React application
- Public website UI
- Admin UI
- React routing
- Components
- Pages
- Forms
- Client-side validation
- Axios/API service integration
- Authentication UI
- Project UI
- Donation UI
- News/events UI
- Gallery/document UI
- Dashboard UI
- Responsive design
- Frontend error/loading states

### Must NOT own

- PostgreSQL schema changes
- Node.js controller/service changes
- Backend business logic
- Payment secret keys
- Payment webhook implementation
- Backend authentication implementation

### Can coordinate with Suchitra on

- API contracts
- Authentication tokens
- Request/response structures
- Validation rules
- Pagination
- Payment integration from frontend
- Error handling

---

# 6. Developer 3 — Assigned Role

Until the third developer is formally assigned, use this temporary role:

**Developer 3 — QA + DevOps + Integration Support**

### Owns

- Testing strategy
- API testing
- Frontend testing
- Integration testing
- Security testing coordination
- Git/repository workflow
- Environment setup documentation
- Development/staging deployment
- CI/CD
- Build verification
- Production deployment preparation
- Backup verification
- Monitoring/logging setup
- Release checklist
- Bug tracking
- Cross-module regression testing

### Must NOT independently modify

- Backend business logic
- PostgreSQL schema
- React business features

unless the change is explicitly assigned by the team.

### Important

When Developer 3 finds a bug:

1. Reproduce it.
2. Record exact steps.
3. Identify affected module.
4. Assign it to the owner.
5. Do not silently rewrite another developer's module.

---

# 7. Ownership Matrix

| Module | Suchitra | Mrinmayee | Developer 3 |
|---|---|---|---|
| PostgreSQL | OWNER | Read only | Test |
| Database migrations | OWNER | No changes | Verify |
| Node.js/Express | OWNER | No changes | Test |
| REST APIs | OWNER | Consume | Test |
| Authentication backend | OWNER | Consume | Test |
| RBAC backend | OWNER | Consume | Test |
| Public React UI | No | OWNER | Test |
| Admin React UI | No | OWNER | Test |
| API integration | Support | OWNER | Test |
| Donation frontend | Support | OWNER | Test |
| Payment backend | OWNER | Consume | Test |
| Payment webhook | OWNER | No | Test |
| Projects backend | OWNER | Consume | Test |
| Projects frontend | No | OWNER | Test |
| News/events frontend | No | OWNER | Test |
| News/events backend | OWNER | Consume | Test |
| Gallery/documents frontend | No | OWNER | Test |
| Gallery/documents backend | OWNER | Consume | Test |
| Reports backend | OWNER | Consume | Test |
| Reports UI | No | OWNER | Test |
| Deployment | Support | Support | OWNER |
| CI/CD | Support | Support | OWNER |
| Security testing | Support | Support | OWNER |
| Documentation | Shared | Shared | OWNER for release docs |

---

# 8. Shared Architecture

```text
                         PUBLIC USERS
                              |
                              v
                     +----------------+
                     | React Frontend |
                     +--------+-------+
                              |
                             HTTPS
                              |
                              v
                     +----------------+
                     | Node.js API    |
                     | Express        |
                     +--------+-------+
                              |
                +-------------+-------------+
                |             |             |
                v             v             v
             Auth         Projects       Donations
                |             |             |
                +-------------+-------------+
                              |
                              v
                     +----------------+
                     | PostgreSQL     |
                     +----------------+
                              |
                +-------------+-------------+
                |             |             |
                v             v             v
             Storage       Payment       Email
             Service       Gateway       Service
```

---

# 9. Repository Ownership Rules

Recommended project structure:

```text
sect-project/
│
├── frontend/
│   └── React application
│
├── backend/
│   └── Node.js/Express application
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── docs/
│
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
├── tests/
│
├── .gitignore
├── README.md
└── ANTIGRAVITY_TEAM_RULES.md
```

### Ownership

```text
frontend/  -> Mrinmayee
backend/   -> Suchitra
database/  -> Suchitra
tests/     -> Developer 3 + module owners
docs/      -> Shared
deployment -> Developer 3
```

---

# 10. Antigravity Global Rules

Every Antigravity instance must follow these rules.

## Rule 1 — Respect role boundaries

Before changing any file, determine:

- Which module does this file belong to?
- Who owns that module?
- Is this change within my assigned role?

If it belongs to another developer, do not modify it.

## Rule 2 — No unauthorized architecture changes

Do not:

- Change database architecture
- Replace PostgreSQL
- Replace React
- Replace Node.js/Express
- Introduce microservices
- Replace the authentication architecture
- Change payment architecture

without team approval.

## Rule 3 — No destructive changes

Never:

- Delete another developer's module
- Drop production tables
- Delete migrations
- Remove APIs because they appear unused
- Rename shared APIs without coordination
- Change environment variable names without coordination

## Rule 4 — Preserve existing work

Before editing:

1. Read the existing code.
2. Understand current behavior.
3. Check Git status.
4. Check recent commits if needed.
5. Make the smallest required change.

## Rule 5 — Do not create duplicate implementations

Before creating:

- API service
- React component
- database table
- utility
- authentication helper

search the repository first.

---

# 11. API Contract Rules

The backend owner defines the API contract.

The frontend owner consumes the contract.

Example:

```http
GET /api/v1/projects
GET /api/v1/projects/:id
POST /api/v1/projects
PUT /api/v1/projects/:id
DELETE /api/v1/projects/:id
```

Frontend must not assume undocumented response fields.

Backend must document:

- Endpoint
- HTTP method
- Authentication requirement
- Request body
- Query parameters
- Response format
- Error format
- Pagination
- Authorization requirement

---

# 12. Standard API Response

Use a consistent response structure.

### Success

```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [],
  "meta": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

The exact structure may be changed only through team agreement and documentation.

---

# 13. Database Rules

Suchitra owns database architecture.

All database changes must:

- Have a migration
- Use foreign keys where appropriate
- Use constraints
- Use indexes where needed
- Include created_at/updated_at where appropriate
- Avoid storing unnecessary sensitive information
- Avoid storing payment card/CVV/UPI PIN information
- Preserve referential integrity

### No direct production database experimentation.

Use:

```text
Development DB
      ↓
Staging DB
      ↓
Production DB
```

---

# 14. Payment Security Rules

Payment is a high-risk module.

### Never

- Store card number
- Store CVV
- Store UPI PIN
- Store banking password
- Put payment secret keys in React
- Put gateway secret keys in Git
- Trust frontend payment success alone

### Correct flow

```text
React
  |
  | create donation request
  v
Node.js
  |
  | create payment order
  v
Payment Gateway
  |
  v
User Payment
  |
  v
Gateway Webhook
  |
  v
Node.js Verification
  |
  v
PostgreSQL
  |
  v
Donation = SUCCESS
```

The backend must independently verify payment status.

Webhook processing must be idempotent.

---

# 15. Environment Variables

Secrets must exist only in environment configuration.

Example:

```text
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
PAYMENT_KEY_ID=
PAYMENT_KEY_SECRET=
PAYMENT_WEBHOOK_SECRET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
EMAIL_API_KEY=
```

Never commit `.env` files containing real secrets.

Commit only:

```text
.env.example
```

---

# 16. Git Workflow

Use feature branches.

### Suchitra

```text
feature/backend-auth
feature/backend-projects
feature/backend-donations
feature/backend-payments
feature/database-schema
```

### Mrinmayee

```text
feature/frontend-home
feature/frontend-projects
feature/frontend-admin
feature/frontend-donation
feature/frontend-api-integration
```

### Developer 3

```text
test/integration
test/security
ci/setup
deploy/staging
```

Recommended workflow:

```text
main
  |
  +-- develop
        |
        +-- feature/...
```

No developer should directly push unfinished work to `main`.

---

# 17. Commit Rules

Use clear commits.

Good:

```text
feat(backend): add project CRUD API
feat(frontend): add project listing page
feat(database): add project tables
fix(payment): verify webhook signature
test(api): add donation payment tests
docs(api): document project endpoints
```

Avoid:

```text
update
changes
final
done
new code
test
```

---

# 18. Work Synchronization

Because 3 devices are being used:

### Before starting work

Each developer should:

1. Pull latest changes.
2. Check branch.
3. Check Git status.
4. Read this file.
5. Check assigned task.
6. Check recent changes affecting the module.

### Before committing

1. Run tests.
2. Run build.
3. Check changed files.
4. Ensure no `.env` or secret files are included.
5. Review the diff.
6. Commit only assigned work.

---

# 19. Definition of Done

A task is NOT complete just because the code works locally.

A task is complete when:

- Code implemented
- Existing functionality not broken
- Validation added
- Error handling added
- Security considered
- Tests added where applicable
- Build passes
- API documentation updated if API changed
- Database migration added if schema changed
- Git diff reviewed
- Commit created
- Team notified of integration requirements

---

# 20. Backend Definition of Done — Suchitra

For every backend feature:

```text
Route
  ↓
Middleware
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Repository/DB
```

Check:

- Authentication
- Authorization
- Validation
- Error handling
- Database transaction requirements
- SQL injection protection
- Rate limiting where applicable
- Logging
- API documentation

---

# 21. Frontend Definition of Done — Mrinmayee

For every frontend feature:

- Responsive layout
- Loading state
- Empty state
- Error state
- Form validation
- API integration
- Authentication handling
- Permission-aware UI where required
- User-friendly success/error messages
- No hardcoded production API secrets
- Build passes

---

# 22. QA Definition of Done — Developer 3

For every release:

```text
Frontend build
       ↓
Backend build
       ↓
Database migration check
       ↓
API test
       ↓
Integration test
       ↓
Security test
       ↓
Payment test
       ↓
Regression test
       ↓
Staging deployment
```

---

# 23. MVP Development Order

## Phase 1 — Foundation

### Suchitra

- PostgreSQL setup
- Database architecture
- Initial migrations
- Express setup
- Environment configuration
- Authentication backend
- RBAC backend
- API error handling
- Security middleware

### Mrinmayee

- React setup
- Routing
- Layout
- Header/footer
- Public UI foundation
- API client
- Authentication UI
- Common components

### Developer 3

- Repository setup
- Branching rules
- Test framework
- CI setup
- Development/staging environment
- Basic deployment documentation

---

# 24. Phase 2 — Core Modules

### Suchitra

- Projects API
- Categories API
- News API
- Events API
- Gallery API
- Documents API
- Contact API

### Mrinmayee

- Projects pages
- Project details
- News
- Events
- Gallery
- Documents
- Contact
- Admin UI

### Developer 3

- API testing
- Integration testing
- Regression testing
- Build verification

---

# 25. Phase 3 — Donation

### Suchitra

- Donation database
- Donation API
- Payment order creation
- Payment verification
- Webhook
- Transaction handling
- Receipt data
- Audit logs

### Mrinmayee

- Donation page
- Donation form
- Payment initiation
- Payment result page
- Donation status UI
- Admin donation UI

### Developer 3

- Successful payment test
- Failed payment test
- Duplicate webhook test
- Invalid signature test
- Wrong amount test
- Timeout/cancellation test
- Security regression test

---

# 26. Phase 4 — Admin & Reporting

### Suchitra

- Admin APIs
- User management APIs
- Reports APIs
- Audit log APIs

### Mrinmayee

- Admin dashboard
- User management UI
- Project management UI
- Donation management UI
- Reports UI
- Audit UI where required

### Developer 3

- Permission testing
- Role testing
- Regression testing
- Release preparation

---

# 27. Security Checklist

## Authentication

- Password hashing
- Strong password policy
- JWT security
- Refresh token protection
- Logout/token invalidation strategy
- Login rate limiting

## Authorization

Every protected endpoint must check permissions on the backend.

Frontend hiding a button is NOT security.

## Input

Validate all:

- Body
- Query parameters
- Route parameters
- File uploads

## Database

- Parameterized queries
- Least-privilege DB user
- Constraints
- Backups
- Migration control

## API

- HTTPS
- CORS restriction
- Security headers
- Rate limiting
- Centralized errors
- No sensitive data in logs

## Payment

- Server-side verification
- Webhook verification
- Idempotency
- No payment secrets in frontend
- No card/CVV storage

---

# 28. Conflict Resolution Between Developers

If two modules require a change in the same file:

1. Do not overwrite the other developer's work.
2. Discuss the change.
3. Decide the module owner.
4. Create a small shared interface/change.
5. Update the API/schema contract.
6. Test both modules.
7. Merge carefully.

### Priority

```text
Security
   ↓
Data integrity
   ↓
API contract
   ↓
Existing functionality
   ↓
New feature
   ↓
Code optimization
```

---

# 29. Antigravity Instruction Template

Every developer's Antigravity should internally follow this pattern:

```text
You are working on the SECT project.

First read:
1. ANTIGRAVITY_TEAM_RULES.md
2. Project README
3. Relevant module documentation
4. Existing code before modifying it

Your role is:
[DEVELOPER ROLE]

Your allowed ownership is:
[ASSIGNED MODULES]

You MUST NOT modify:
[OTHER TEAM MODULES]

Before coding:
- Check Git status.
- Inspect existing implementation.
- Search for existing functionality.
- Follow the shared architecture.
- Do not invent a parallel architecture.

During coding:
- Change only files required for your assigned task.
- Preserve existing functionality.
- Follow existing conventions.
- Add validation and error handling.
- Do not expose secrets.

After coding:
- Run tests.
- Run build.
- Review Git diff.
- Report changed files.
- Report API/database contract changes.
- Report any dependency on another developer.
```

---

# 30. Current Team Assignment Summary

## Suchitra

**Backend + Database Owner**

```text
PostgreSQL
Node.js
Express
Authentication
RBAC
REST API
Projects API
Donation API
Payment backend
Webhook
Reports API
Audit logs
Backend security
```

## Mrinmayee

**Frontend + API Integration Owner**

```text
React
Public website
Admin UI
Pages
Components
Forms
Axios/API integration
Authentication UI
Projects UI
Donation UI
Dashboard UI
Responsive design
```

## Developer 3

**QA + DevOps + Integration Owner**

```text
Testing
Integration testing
Security testing
CI/CD
Staging
Deployment
Monitoring
Release management
Bug tracking
Regression testing
```

---

# 31. Golden Rule

> **Each Antigravity instance must behave as a specialist, not as the whole development team.**

If Suchitra's Antigravity is asked to build a React page, it must not take over the frontend.

If Mrinmayee's Antigravity is asked to change PostgreSQL tables, it must not directly modify the database architecture.

If Developer 3's Antigravity finds a backend bug, it should report/fix it only when the task is explicitly assigned; otherwise it should create a reproducible bug report for Suchitra.

**The shared architecture belongs to the team. Module implementation belongs to the assigned owner.**

---

# 32. Final Project Principle

```text
                 SECT PROJECT
                      |
          +-----------+-----------+
          |           |           |
      Suchitra    Mrinmayee   Developer 3
          |           |           |
       Backend     Frontend       QA
       Database    API Client     DevOps
       Payment     UI             Testing
          |           |           |
          +-----------+-----------+
                      |
                Shared Contract
                      |
          API + DB + Git + Docs
```

**No developer should work as an isolated application owner.**

The three developers own separate implementation areas but integrate through clearly defined contracts.

**End of shared Antigravity instructions.**
