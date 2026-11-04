# SECT Database Architecture & Schema Specification

**Author:** Suchitra (Database Architect & Backend Developer)  
**Database Engine:** PostgreSQL 14+  
**Reference:** `ANTIGRAVITY_TEAM_RULES.md` (Sections 7, 9, 13, 14, 20)  

---

## 1. Architectural Principles

1. **Strict Referential Integrity**: Foreign keys with appropriate `ON DELETE RESTRICT` or `ON DELETE CASCADE` actions.
2. **Soft Deletions**: Entities linked to financial or historical transactions (e.g. `projects`, `news_articles`) utilize `is_deleted BOOLEAN DEFAULT FALSE` and `deleted_at TIMESTAMP WITH TIME ZONE`.
3. **Audit Trails**: Core entities maintain `created_at`, `updated_at`, and `created_by`. Sensitive operations record state in `audit_logs`.
4. **Data Security & Privacy**:
   - Passwords stored only as bcrypt hashes.
   - **Zero** storage of credit card numbers, CVVs, UPI PINs, or banking passwords.
   - Idempotency keys on payment transactions to prevent duplicate processing.
5. **Performance Indexing**:
   - B-tree indexes on foreign keys, email lookups, project slugs, donation statuses, and date filters.

---

## 2. Entity Relationship Diagram (Conceptual)

```text
       +---------------+             +--------------------+
       |     roles     | <---------> |    permissions     |
       +---------------+             +--------------------+
               ^
               | (user_roles)
               v
       +---------------+             +--------------------+
       |     users     | ----------> |     audit_logs     |
       +---------------+             +--------------------+
          |         |
          |         +-------------------+
          v                             v
+-------------------+         +--------------------+
|     projects      |         |     donations      | <-----+
+-------------------+         +--------------------+       |
   ^             |                      |                  |
   |             v                      v                  v
+------------+ +----------------+ +----------------+ +-------------+
| categories | | project_updates| |payment_orders  | |  receipts   |
+------------+ +----------------+ +----------------+ +-------------+
                                        |
                                        v
                                  +--------------------+
                                  |payment_transactions|
                                  +--------------------+
```

---

## 3. Core Database Tables & Schemas

### 3.1 Users & RBAC

#### `roles`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(50) UNIQUE NOT NULL) — `ADMIN`, `STAFF`, `MEMBER`, `DONOR`, `VOLUNTEER`
- `description` (TEXT)
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

#### `permissions`
- `id` (SERIAL PRIMARY KEY)
- `code` (VARCHAR(100) UNIQUE NOT NULL) — e.g. `projects:create`, `donations:read`, `reports:export`
- `module` (VARCHAR(50) NOT NULL)
- `description` (TEXT)

#### `role_permissions`
- `role_id` (INT REFERENCES roles(id) ON DELETE CASCADE)
- `permission_id` (INT REFERENCES permissions(id) ON DELETE CASCADE)
- PRIMARY KEY (`role_id`, `permission_id`)

#### `users`
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `full_name` (VARCHAR(150) NOT NULL)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `password_hash` (VARCHAR(255) NOT NULL)
- `phone` (VARCHAR(20))
- `address` (TEXT)
- `pan_number` (VARCHAR(10))
- `is_active` (BOOLEAN DEFAULT TRUE)
- `last_login_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

#### `user_roles`
- `user_id` (UUID REFERENCES users(id) ON DELETE CASCADE)
- `role_id` (INT REFERENCES roles(id) ON DELETE RESTRICT)
- PRIMARY KEY (`user_id`, `role_id`)

---

### 3.2 Projects & Categories

#### `categories`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100) UNIQUE NOT NULL)
- `slug` (VARCHAR(120) UNIQUE NOT NULL)
- `description` (TEXT)
- `icon` (VARCHAR(100))
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

#### `projects`
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `title` (VARCHAR(255) NOT NULL)
- `slug` (VARCHAR(280) UNIQUE NOT NULL)
- `summary` (VARCHAR(500) NOT NULL)
- `description` (TEXT NOT NULL)
- `category_id` (INT REFERENCES categories(id) ON DELETE RESTRICT)
- `target_amount` (NUMERIC(14, 2) NOT NULL DEFAULT 0.00)
- `raised_amount` (NUMERIC(14, 2) NOT NULL DEFAULT 0.00)
- `beneficiaries` (VARCHAR(255))
- `location` (VARCHAR(255))
- `status` (VARCHAR(30) DEFAULT 'ACTIVE') — `DRAFT`, `ACTIVE`, `COMPLETED`, `ARCHIVED`
- `hero_image_url` (VARCHAR(500))
- `is_featured` (BOOLEAN DEFAULT FALSE)
- `is_deleted` (BOOLEAN DEFAULT FALSE)
- `deleted_at` (TIMESTAMPTZ)
- `created_by` (UUID REFERENCES users(id) ON DELETE SET NULL)
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

#### `project_updates`
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `project_id` (UUID REFERENCES projects(id) ON DELETE CASCADE)
- `title` (VARCHAR(255) NOT NULL)
- `content` (TEXT NOT NULL)
- `image_url` (VARCHAR(500))
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

---

### 3.3 Donations & Payments

#### `donations`
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `user_id` (UUID REFERENCES users(id) ON DELETE SET NULL)
- `project_id` (UUID REFERENCES projects(id) ON DELETE SET NULL)
- `amount` (NUMERIC(12, 2) NOT NULL CHECK (amount > 0))
- `currency` (VARCHAR(3) DEFAULT 'INR')
- `donor_name` (VARCHAR(150) NOT NULL)
- `donor_email` (VARCHAR(255) NOT NULL)
- `donor_phone` (VARCHAR(20))
- `donor_pan` (VARCHAR(10))
- `donor_address` (TEXT)
- `is_anonymous` (BOOLEAN DEFAULT FALSE)
- `is_80g_claimed` (BOOLEAN DEFAULT TRUE)
- `status` (VARCHAR(30) DEFAULT 'PENDING') — `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`
- `receipt_number` (VARCHAR(50) UNIQUE)
- `payment_method` (VARCHAR(20)) — `UPI_QR` for manually reconciled transfers.
- `payment_reference` (VARCHAR(100)) — donor-reported UPI reference; unique case-insensitively for UPI QR submissions.
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

Migration `011_add_upi_donation_reconciliation.sql` adds the payment method/reference fields and indexes pending manual review rows. UPI reports remain `PENDING` until an administrator verifies the transaction against bank records.

#### `payment_orders`
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `donation_id` (UUID REFERENCES donations(id) ON DELETE CASCADE)
- `gateway_order_id` (VARCHAR(100) UNIQUE NOT NULL)
- `gateway_name` (VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY')
- `amount_in_paise` (BIGINT NOT NULL)
- `currency` (VARCHAR(3) DEFAULT 'INR')
- `status` (VARCHAR(30) DEFAULT 'CREATED')
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

#### `payment_transactions`
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `donation_id` (UUID REFERENCES donations(id) ON DELETE CASCADE)
- `gateway_payment_id` (VARCHAR(100) UNIQUE NOT NULL)
- `gateway_order_id` (VARCHAR(100) NOT NULL)
- `payment_method` (VARCHAR(50)) — `UPI`, `NETBANKING`, `CARD`, `WALLET`
- `amount` (NUMERIC(12, 2) NOT NULL)
- `fee` (NUMERIC(10, 2) DEFAULT 0.00)
- `tax` (NUMERIC(10, 2) DEFAULT 0.00)
- `gateway_signature` (VARCHAR(255))
- `webhook_payload` (JSONB)
- `status` (VARCHAR(30) NOT NULL) — `CAPTURED`, `FAILED`
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

---

### 3.4 Content, Inquiries & Volunteers

#### `news_articles`
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `title` (VARCHAR(255) NOT NULL)
- `slug` (VARCHAR(280) UNIQUE NOT NULL)
- `excerpt` (VARCHAR(500))
- `content` (TEXT NOT NULL)
- `image_url` (VARCHAR(500))
- `published_at` (TIMESTAMPTZ)
- `is_published` (BOOLEAN DEFAULT TRUE)
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

#### `events`
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `title` (VARCHAR(255) NOT NULL)
- `slug` (VARCHAR(280) UNIQUE NOT NULL)
- `description` (TEXT NOT NULL)
- `event_date` (TIMESTAMPTZ NOT NULL)
- `location` (VARCHAR(255) NOT NULL)
- `is_virtual` (BOOLEAN DEFAULT FALSE)
- `max_participants` (INT)
- `hero_image_url` (VARCHAR(500))
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

#### `event_registrations`
- `id` (SERIAL PRIMARY KEY)
- `event_id` (UUID REFERENCES events(id) ON DELETE CASCADE)
- `name` (VARCHAR(150) NOT NULL)
- `email` (VARCHAR(255) NOT NULL)
- `phone` (VARCHAR(20))
- `registered_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

#### `media_files`
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `title` (VARCHAR(200) NOT NULL)
- `media_type` (VARCHAR(20) NOT NULL) — `IMAGE`, `VIDEO`
- `file_url` (VARCHAR(500) NOT NULL)
- `thumbnail_url` (VARCHAR(500))
- `category` (VARCHAR(100))
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

#### `documents`
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `title` (VARCHAR(200) NOT NULL)
- `file_url` (VARCHAR(500) NOT NULL)
- `file_size_kb` (INT)
- `doc_type` (VARCHAR(50) NOT NULL) — `ANNUAL_REPORT`, `AUDIT_REPORT`, `POLICY`, `80G_CERTIFICATE`
- `year` (VARCHAR(10))
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

#### `inquiries`
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `name` (VARCHAR(150) NOT NULL)
- `email` (VARCHAR(255) NOT NULL)
- `phone` (VARCHAR(20))
- `subject` (VARCHAR(200))
- `message` (TEXT NOT NULL)
- `status` (VARCHAR(30) DEFAULT 'PENDING') — `PENDING`, `IN_REVIEW`, `RESOLVED`
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

#### `volunteer_applications`
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `full_name` (VARCHAR(150) NOT NULL)
- `email` (VARCHAR(255) NOT NULL)
- `phone` (VARCHAR(20) NOT NULL)
- `interests` (TEXT[])
- `availability` (VARCHAR(100))
- `experience` (TEXT)
- `status` (VARCHAR(30) DEFAULT 'NEW')
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

---

### 3.5 System Audit Trail

#### `audit_logs`
- `id` (BIGSERIAL PRIMARY KEY)
- `user_id` (UUID REFERENCES users(id) ON DELETE SET NULL)
- `action` (VARCHAR(100) NOT NULL) — `PROJECT_CREATED`, `DONATION_VERIFIED`, `USER_ROLE_UPDATED`
- `entity_type` (VARCHAR(50) NOT NULL)
- `entity_id` (VARCHAR(100) NOT NULL)
- `old_values` (JSONB)
- `new_values` (JSONB)
- `ip_address` (VARCHAR(45))
- `user_agent` (VARCHAR(255))
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)
