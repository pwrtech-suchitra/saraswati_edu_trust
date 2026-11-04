# SECT Database Architecture & Schema Specification

**Author:** Suchitra (Database Architect & Backend Developer)  
**Database Engine:** PostgreSQL 14+  
**Reference:** `ANTIGRAVITY_TEAM_RULES.md` (Sections 7, 9, 13, 14, 20)  

---

## 1. Architectural Principles

1. **Strict Referential Integrity**: Foreign keys with appropriate `ON DELETE RESTRICT` or `ON DELETE CASCADE` actions.
2. **Soft Deletions**: Content entities (e.g. `projects`, `news_articles`) utilize `is_deleted BOOLEAN DEFAULT FALSE` and `deleted_at TIMESTAMP WITH TIME ZONE`.
3. **Audit Trails**: Core entities maintain `created_at`, `updated_at`, and `created_by`. Sensitive operations record state in `audit_logs`.
4. **Data Security & Privacy**:
   - Passwords stored only as bcrypt hashes.
   - Donation QR payments are made directly through the trust's UPI provider; the application does not process or store them.
5. **Performance Indexing**:
   - B-tree indexes on foreign keys, email lookups, project slugs, and date filters.

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
                                             ^
                                             |
                                  +-------------------+
                                  |     projects      |
                                  +-------------------+
                                    ^             |
                                    |             v
                              +------------+ +----------------+
                              | categories | | project_updates|
                              +------------+ +----------------+
```

---

## 3. Core Database Tables & Schemas

### 3.1 Users & RBAC

#### `roles`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(50) UNIQUE NOT NULL) — `ADMIN`, `STAFF`, `MEMBER`, `VOLUNTEER`
- `description` (TEXT)
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)

#### `permissions`
- `id` (SERIAL PRIMARY KEY)
- `code` (VARCHAR(100) UNIQUE NOT NULL) — e.g. `projects:create`, `users:manage`
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

### 3.3 Donations

The public donation page displays the static QR image from the frontend assets. Payments happen outside the
application, so there are no donation, payment, receipt, or contribution-tracking
tables. Migration `012_remove_donation_and_payment_data.sql` removes legacy donation
and payment tables, donor records, contribution-related audit entries, funding fields,
and trust-profile QR/80G configuration from existing databases.

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
- `action` (VARCHAR(100) NOT NULL) — `PROJECT_CREATED`, `USER_ROLE_UPDATED`
- `entity_type` (VARCHAR(50) NOT NULL)
- `entity_id` (VARCHAR(100) NOT NULL)
- `old_values` (JSONB)
- `new_values` (JSONB)
- `ip_address` (VARCHAR(45))
- `user_agent` (VARCHAR(255))
- `created_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)
