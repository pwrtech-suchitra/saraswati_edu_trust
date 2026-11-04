# SECT Web Application — REST API Specification (Contract)

**Author:** Suchitra (Backend & Database Developer)  
**Consumer:** Mrinmayee (Frontend Developer) & Developer 3 (QA)  
**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api/v1`  

---

## 1. Global Architectural Standards

### 1.1 Authentication & Authorization
- Protected endpoints require an `Authorization` HTTP header with a Bearer JWT:
  ```http
  Authorization: Bearer <jwt_access_token>
  ```
- Expired access tokens return HTTP `401 Unauthorized` with error code `TOKEN_EXPIRED`.
- Insufficient role permissions return HTTP `403 Forbidden` with error code `FORBIDDEN`.

### 1.2 Standard Success Response Envelope
All successful requests return HTTP `200` (or `201 Created`) with this uniform JSON envelope:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 10,
    "totalPages": 12
  }
}
```

### 1.3 Standard Error Response Envelope
All client or server errors return appropriate HTTP status codes (`400`, `401`, `403`, `404`, `422`, `429`, `500`):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email address is required"
    }
  ]
}
```

---

## 2. Authentication & User APIs (`/api/v1/auth`)

### 2.1 Register User / Donor
- **Endpoint:** `POST /api/v1/auth/register`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "full_name": "Sita Sharma",
    "email": "sita@example.com",
    "password": "Password123!",
    "phone": "9876543210"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "user": {
        "id": "u_101",
        "full_name": "Sita Sharma",
        "email": "sita@example.com",
        "role": "MEMBER"
      },
      "access_token": "eyJhbGciOi...",
      "refresh_token": "eyJhbGciOi..."
    }
  }
  ```

### 2.2 Login User / Admin
- **Endpoint:** `POST /api/v1/auth/login`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "email": "admin@sect.org",
    "password": "AdminPassword123!"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "u_001",
        "full_name": "SECT Superadmin",
        "email": "admin@sect.org",
        "role": "ADMIN"
      },
      "access_token": "eyJhbGciOi...",
      "refresh_token": "eyJhbGciOi..."
    }
  }
  ```

### 2.3 Refresh Access Token
- **Endpoint:** `POST /api/v1/auth/refresh`
- **Auth:** Public (Requires valid `refresh_token` in body)
- **Request Body:**
  ```json
  {
    "refresh_token": "eyJhbGciOi..."
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "access_token": "eyJhbGciOi..."
    }
  }
  ```

### 2.4 User Profile
- **Endpoint:** `GET /api/v1/auth/profile`
- **Auth:** Bearer Token
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Profile retrieved",
    "data": {
      "id": "u_101",
      "full_name": "Sita Sharma",
      "email": "sita@example.com",
      "phone": "9876543210",
      "role": "MEMBER",
      "created_at": "2026-03-01T10:00:00Z"
    }
  }
  ```

---

## 3. Projects & Categories APIs (`/api/v1/projects`, `/api/v1/categories`)

### 3.1 List All Projects
- **Endpoint:** `GET /api/v1/projects`
- **Auth:** Public
- **Query Parameters:**
  - `category` (optional, string: slug or category ID)
  - `status` (optional, string: `ACTIVE`, `COMPLETED`, `PLANNED`)
  - `search` (optional, string: keyword in title or description)
  - `page` (optional, integer, default: `1`)
  - `limit` (optional, integer, default: `9`)
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Projects retrieved successfully",
    "data": [
      {
        "id": "p_01",
        "title": "Solar Lighting for Rural Schools",
        "slug": "solar-lighting-rural-schools",
        "summary": "Installing rooftop solar systems in 25 off-grid village schools.",
        "category_name": "Renewable Energy",
        "category_slug": "renewable-energy",
        "status": "ACTIVE",
        "hero_image_url": "/uploads/projects/solar-school.jpg",
        "created_at": "2026-01-15T08:00:00Z"
      }
    ],
    "meta": {
      "total": 14,
      "page": 1,
      "limit": 9,
      "totalPages": 2
    }
  }
  ```

### 3.2 Get Single Project Details
- **Endpoint:** `GET /api/v1/projects/:id` (accepts UUID or `slug`)
- **Auth:** Public
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Project details retrieved",
    "data": {
      "id": "p_01",
      "title": "Solar Lighting for Rural Schools",
      "slug": "solar-lighting-rural-schools",
      "description": "Full markdown or rich text project explanation...",
      "category_name": "Renewable Energy",
      "status": "ACTIVE",
      "beneficiaries": "1,200 rural students",
      "location": "Sundargarh & Keonjhar Districts",
      "hero_image_url": "/uploads/projects/solar-school.jpg",
      "gallery": [
        "/uploads/projects/solar-1.jpg",
        "/uploads/projects/solar-2.jpg"
      ],
      "updates": [
        {
          "id": "up_01",
          "title": "Phase 1 Complete: 10 Schools Powered",
          "content": "Batteries and solar arrays successfully installed.",
          "created_at": "2026-02-10T12:00:00Z"
        }
      ]
    }
  }
  ```

### 3.3 Create Project
- **Endpoint:** `POST /api/v1/projects`
- **Auth:** Bearer Token (`ADMIN`, `STAFF`)
- **Body:** Multipart Form Data (`hero_image` file + text fields)
- **Response (`201 Created`)**

### 3.4 Update Project
- **Endpoint:** `PUT /api/v1/projects/:id`
- **Auth:** Bearer Token (`ADMIN`, `STAFF`)

### 3.5 Soft-Delete Project
- **Endpoint:** `DELETE /api/v1/projects/:id`
- **Auth:** Bearer Token (`ADMIN`)
- **Note:** Marks `is_deleted = true` to preserve project history.

### 3.6 List Project Categories
- **Endpoint:** `GET /api/v1/categories`
- **Auth:** Public
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Categories retrieved",
    "data": [
      { "id": "cat_1", "name": "Education", "slug": "education" },
      { "id": "cat_2", "name": "Renewable Energy", "slug": "renewable-energy" },
      { "id": "cat_3", "name": "Environmental Protection", "slug": "environmental-protection" },
      { "id": "cat_4", "name": "Sustainable Livelihood", "slug": "sustainable-livelihood" },
      { "id": "cat_5", "name": "Solid-Waste Management", "slug": "solid-waste-management" }
    ]
  }
  ```

---

## 4. Donations

The public website displays a static SECT UPI QR code. Payments are made outside this API; it has no donation submission, payment, reconciliation, or receipt endpoints and does not store donation records.

---

## 5. News, Events & Content APIs (`/api/v1/news`, `/api/v1/events`, `/api/v1/media`, `/api/v1/documents`)

### 5.1 News Articles
- `GET /api/v1/news` — Public article list with pagination.
- `GET /api/v1/news/:id` — Single article with full body and gallery.
- `POST /api/v1/news` — Admin: publish news article.

### 5.2 Events
- `GET /api/v1/events` — Upcoming and past community events.
- `GET /api/v1/events/:id` — Event details and location.
- `POST /api/v1/events/:id/register` — Register attendee for community workshop/webinar.

### 5.3 Gallery & Documents
- `GET /api/v1/media` — Photo and video gallery with category filters.
- `POST /api/v1/media/upload` — Admin multipart upload (`image` or `video_url`).
- `GET /api/v1/documents` — Annual reports, compliance statements, policy PDFs.

---

## 6. Contact & Volunteer APIs (`/api/v1/contact`, `/api/v1/volunteers`)

### 6.1 Submit Contact Inquiry
- **Endpoint:** `POST /api/v1/contact`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "name": "Pooja Das",
    "email": "pooja@example.com",
    "phone": "9811223344",
    "subject": "Community Solar Inquiry",
    "message": "We would like to request solar street lighting in our panchayat."
  }
  ```

### 6.2 Submit Volunteer Application
- **Endpoint:** `POST /api/v1/volunteers`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "full_name": "Rohan Jena",
    "email": "rohan@example.com",
    "phone": "9777123456",
    "interests": ["Education", "Solid-Waste Management"],
    "availability": "WEEKENDS",
    "experience": "Taught science to middle school kids for 1 year."
  }
  ```

---

## 7. Admin APIs (`/api/v1/admin`)

### 7.1 Admin Overview Metrics
- `GET /api/v1/admin/stats` — Returns active project and pending inquiry counts.

### 7.2 Admin User Management
- `GET /api/v1/admin/users` — List users with an optional role filter.
- `PATCH /api/v1/admin/users/:id/role` — Update user role (`ADMIN`, `STAFF`, `MEMBER`, `VOLUNTEER`).

### 7.3 Inquiry Management
- `GET /api/v1/admin/inquiries` — List public inquiries.
- `PATCH /api/v1/admin/inquiries/:id/status` — Update inquiry status.

---

## 8. System Health API (`/api/v1/health`)

- `GET /api/v1/health/live` reports process liveness without querying PostgreSQL.
- `GET /api/v1/health/ready` reports readiness and returns `503` if PostgreSQL is unavailable.
- `GET /api/v1/health` remains an alias for readiness.
- **Auth:** Public
- **Liveness response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "SECT Backend API process is alive",
    "data": {
      "status": "UP",
      "timestamp": "2026-03-08T11:45:00Z",
      "uptime_seconds": 3600
    }
  }
  ```
