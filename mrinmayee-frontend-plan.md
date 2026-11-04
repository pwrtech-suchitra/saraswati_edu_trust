# SECT Project — Mrinmayee's Implementation Plan (Frontend & API Integration)

**Developer:** Mrinmayee  
**Role:** Frontend Developer + API Integration Specialist  
**Workspace:** `c:\Users\Suchitra Mishra\Desktop\SECT\`  
**Reference Documents:** `ANTIGRAVITY_TEAM_RULES.md` & `suchitra-backend-plan.md`  

> **Current donation behavior:** This historical plan's donation/payment flow is superseded. The live frontend displays the trust's UPI QR code only and does not submit or record contributions.

---

## 1. Cross-Document Analysis & Role Boundary Verification

Based on a thorough analysis of both [ANTIGRAVITY_TEAM_RULES.md](file:///c:/Users/Suchitra%20Mishra/Desktop/SECT/ANTIGRAVITY_TEAM_RULES.md) (Sections 5, 7, 9, 10, 11, 12, 14, 21, 30 & 31) and [suchitra-backend-plan.md](file:///c:/Users/Suchitra%20Mishra/Desktop/SECT/suchitra-backend-plan.md):

### What Mrinmayee OWNS:
- **`frontend/`**: Complete React application structure, client-side routing, build configuration (Vite or CRA), components, styling, and assets.
- **Public Website UI**: Home, About Us, Mission & Vision, Trust Activities, Projects listing & details, News & Events, Photo Gallery, Document Downloads, and Contact/Inquiry forms.
- **Admin & Management UI**: Admin dashboard, metrics overview, user management table, project management, donation records table, inquiry inbox, and report views.
- **API Service Layer**: Axios HTTP client, centralized API services, request/response interceptors, and error translation.
- **Client-Side State & Auth**: Auth Context / Redux / Zustand, JWT token storage, session hydration, and route guards (`ProtectedRoute`, `AdminRoute`).
- **Donation & Checkout Flow**: Donation form, donation amount selection, donor information collection, payment gateway SDK checkout popup (Razorpay/Stripe checkout modal), payment callback handling, receipt view, and status polling/confirmation.
- **UX & Accessibility Quality**: Responsive design (mobile, tablet, desktop), loading spinners/skeletons, empty states, error boundaries, user-friendly notifications (toasts/alerts).

### What Mrinmayee MUST NOT Touch:
- **`backend/`**: Node.js, Express controllers, services, routes, middleware, and business logic (Owned exclusively by **Suchitra**).
- **`database/`**: PostgreSQL schema, SQL migrations, database seeders, database connection pool (Owned exclusively by **Suchitra**).
- **Payment Secrets**: Private keys, webhook secrets, and server verification keys must **never** be added to frontend code or `.env`.
- **`deployment/` & CI/CD**: Production deployment scripts, server infrastructure, Docker, CI pipelines (Owned by **Developer 3**).

---

## 2. API Contract Alignment with Suchitra's Backend

Mrinmayee's frontend integrates directly with the backend API designed in `suchitra-backend-plan.md`:

### Base API Configuration:
- **Base URL**: `http://localhost:5000/api/v1` (configured via `VITE_API_BASE_URL` in `.env`)
- **Headers**: `Content-Type: application/json`
- **Authorization**: `Bearer <access_token>` attached automatically via Axios interceptor

### Standard Envelope Handling:
All backend responses adhere to the standard envelope:
```typescript
// Successful API Response
interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

// Error API Response
interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
}
```

### Endpoints Consumed:
| Feature | Backend Endpoint | Method | Auth Required |
|---|---|---|---|
| User Register | `/auth/register` | `POST` | No |
| User Login | `/auth/login` | `POST` | No |
| Refresh Token | `/auth/refresh` | `POST` | Refresh Token |
| User Logout | `/auth/logout` | `POST` | Yes |
| User Profile | `/auth/profile` | `GET` | Yes |
| List Projects | `/projects` | `GET` | No |
| Project Details | `/projects/:id` | `GET` | No |
| Create Project | `/projects` | `POST` | Yes (Admin) |
| Update Project | `/projects/:id` | `PUT` | Yes (Admin) |
| Delete Project | `/projects/:id` | `DELETE` | Yes (Admin) |
| List Categories | `/categories` | `GET` | No |
| News & Events | `/news`, `/events` | `GET` | No |
| Register Event | `/events/:id/register` | `POST` | Optional |
| Media & Documents | `/media`, `/documents` | `GET` | No |
| Submit Inquiry | `/contact` | `POST` | No |
| Create Donation Order | `/donations/create-order` | `POST` | Optional |
| Verify Donation Payment| `/donations/verify` | `POST` | Optional |
| Donor History | `/donations/my-donations`| `GET` | Yes |
| Admin Dashboard Stats | `/admin/stats` | `GET` | Yes (Admin) |
| Admin User List | `/admin/users` | `GET` | Yes (Admin) |
| Admin Inquiries | `/admin/inquiries` | `GET` | Yes (Admin) |
| Reports | `/reports/donations`, `/reports/80g` | `GET` | Yes (Admin) |

---

## 3. Frontend Directory & File Structure to Build

```text
c:\Users\Suchitra Mishra\Desktop\SECT\
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── assets/                   # Public brand icons, logo placeholder
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosClient.js        # Axios instance with interceptors (auth & error)
│   │   │   ├── authApi.js            # Auth endpoints integration
│   │   │   ├── projectApi.js         # Projects & categories endpoints
│   │   │   ├── donationApi.js        # Order creation & verification endpoints
│   │   │   ├── contentApi.js         # News, events, media, documents endpoints
│   │   │   ├── contactApi.js         # Contact inquiry endpoints
│   │   │   └── adminApi.js           # Admin metrics, users, reports endpoints
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx        # Navigation bar with responsive mobile menu
│   │   │   │   ├── Footer.jsx        # SECT Trust info, links, compliance, copyright
│   │   │   │   ├── Button.jsx        # Reusable styled button (variants, loading state)
│   │   │   │   ├── Input.jsx         # Form input with validation error display
│   │   │   │   ├── Modal.jsx         # Reusable modal dialog
│   │   │   │   ├── Loader.jsx        # Loading spinner & skeleton loader
│   │   │   │   ├── Alert.jsx         # Success/error/warning alert banner
│   │   │   │   ├── Pagination.jsx   # Reusable pagination controls
│   │   │   │   └── EmptyState.jsx    # UI for empty lists/results
│   │   │   ├── layout/
│   │   │   │   ├── PublicLayout.jsx  # Layout wrapper for public website
│   │   │   │   └── AdminLayout.jsx   # Layout with sidebar for admin panel
│   │   │   ├── auth/
│   │   │   │   ├── ProtectedRoute.jsx# Auth route guard
│   │   │   │   └── AdminRoute.jsx    # Role-based admin route guard
│   │   │   ├── cards/
│   │   │   │   ├── ProjectCard.jsx   # Card for project listings with progress bar
│   │   │   │   ├── NewsCard.jsx      # Card for news articles
│   │   │   │   └── EventCard.jsx     # Card for upcoming events with date badge
│   │   │   └── donation/
│   │   │       ├── DonationForm.jsx  # Amount selector, 80G tax checkbox, donor fields
│   │   │       └── PaymentModal.jsx  # Checkout trigger & payment processing state
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # User auth state, login, logout, token refresh
│   │   │   └── NotificationContext.jsx# Toast notification system
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js            # Custom hook to consume AuthContext
│   │   │   ├── useNotification.js    # Custom hook for toast alerts
│   │   │   └── useFetch.js           # Generic hook for loading/data/error states
│   │   │
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── HomePage.jsx      # Hero banner, mission highlights, impact counters
│   │   │   │   ├── AboutPage.jsx     # Trust story, leadership, objectives
│   │   │   │   ├── ActivitiesPage.jsx# Environmental, education, livelihood activities
│   │   │   │   ├── ProjectsPage.jsx  # Projects catalog with category filters
│   │   │   │   ├── ProjectDetailPage.jsx# Detailed project description, gallery, donate button
│   │   │   │   ├── NewsEventsPage.jsx# Combined news articles & upcoming events
│   │   │   │   ├── GalleryPage.jsx   # Filterable photo & media gallery
│   │   │   │   ├── DocumentsPage.jsx # Annual reports & compliance documents download
│   │   │   │   ├── ContactPage.jsx   # Inquiry form, office address, map placeholder
│   │   │   │   ├── DonatePage.jsx    # Public donation landing page
│   │   │   │   ├── PaymentSuccessPage.jsx # Verified donation confirmation & receipt download
│   │   │   │   └── PaymentFailurePage.jsx # Payment failure details & retry option
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx     # User/Admin login form
│   │   │   │   ├── RegisterPage.jsx  # User registration form
│   │   │   │   └── ProfilePage.jsx   # User profile & donation history
│   │   │   ├── admin/
│   │   │   │   ├── DashboardPage.jsx # Metrics overview, donation chart, quick actions
│   │   │   │   ├── AdminProjectsPage.jsx# Project CRUD table and modals
│   │   │   │   ├── AdminDonationsPage.jsx# Donation ledger with status filters
│   │   │   │   ├── AdminUsersPage.jsx# User role management table
│   │   │   │   ├── AdminInquiriesPage.jsx# Contact inquiries inbox
│   │   │   │   └── AdminReportsPage.jsx# Financial summary & 80G tax reports export
│   │   │   └── NotFoundPage.jsx      # 404 page
│   │   │
│   │   ├── styles/
│   │   │   └── index.css             # Base styles, typography, Tailwind/custom styles
│   │   ├── utils/
│   │   │   ├── formatters.js         # Currency (INR ₹), date formatting, text truncation
│   │   │   └── validators.js         # Client-side email, phone, PAN number validators
│   │   ├── App.jsx                   # React Router route declarations
│   │   └── main.jsx                  # React DOM entry point
│   ├── .env.example                  # VITE_API_BASE_URL, VITE_PAYMENT_GATEWAY_KEY
│   ├── .gitignore                    # Node/Vite specific gitignore
│   ├── index.html                    # Single page HTML entry
│   └── package.json                  # Frontend dependencies & scripts
```

---

## 4. Phased Implementation Roadmap for Mrinmayee

### Phase 1: Foundation, Design System & Authentication UI
1. **Initialize Frontend Environment**:
   - Initialize React application using Vite (`frontend/package.json`).
   - Dependencies: `react`, `react-dom`, `react-router-dom`, `axios`, `lucide-react` (icons), `clsx`.
   - Setup `.env.example` (`VITE_API_BASE_URL=http://localhost:5000/api/v1`).
2. **Design Tokens & Core Layout**:
   - Define cohesive, modern styling in `index.css`: warm philanthropic palette (forest greens, deep teals, warm amber highlights, crisp clean cards, dark-mode neutral slate).
   - Build `Header.jsx` with mobile drawer navigation.
   - Build `Footer.jsx` with Trust information, quick links, and 80G tax exemption notice.
   - Build `PublicLayout.jsx` and common UI primitives (`Button`, `Input`, `Loader`, `Alert`, `EmptyState`).
3. **API Client & Auth Flow**:
   - Configure `src/api/axiosClient.js`:
     - Base URL loader.
     - Request interceptor: attach `Authorization: Bearer <token>`.
     - Response interceptor: automatically capture `401 Unauthorized` and trigger token refresh or logout.
   - Create `AuthContext.jsx` and `useAuth.js`.
   - Implement `LoginPage.jsx` and `RegisterPage.jsx` with form validation.
   - Implement route guards (`ProtectedRoute.jsx` and `AdminRoute.jsx`).

### Phase 2: Core Public Pages & Content Integration
1. **Home & Informational Pages**:
   - `HomePage.jsx`: Hero section, mission statement, core focus pillars (Education, Renewable Energy, Sustainable Livelihood, Waste Management), recent projects preview, and impact counters.
   - `AboutPage.jsx` & `ActivitiesPage.jsx`: Detailed Trust history, legal registration details, and initiative overviews.
2. **Projects Catalog & Details**:
   - `ProjectsPage.jsx`: Dynamic project listing fetched from `GET /api/v1/projects`, category filter tabs (`GET /api/v1/categories`), and search bar.
   - `ProjectDetailPage.jsx`: Full project description, funding progress bar, impact metrics, photo gallery, and direct "Donate to this Project" button.
3. **News, Events, Media & Documents**:
   - `NewsEventsPage.jsx`: Tabbed view for press releases and upcoming community events with registration dialog.
   - `GalleryPage.jsx`: Grid photo gallery with category filters and image modal preview.
   - `DocumentsPage.jsx`: List of annual reports, audit reports, and policy PDFs with direct download links.
4. **Contact & Inquiries**:
   - `ContactPage.jsx`: Form for public inquiries (`POST /api/v1/contact`), client-side validation for name, email, phone, message, and instant success toast.

### Phase 3: Donation UI & Payment Gateway Integration
1. **Donation Page & Form (`DonatePage.jsx`, `DonationForm.jsx`)**:
   - Pre-set donation amounts (e.g., ₹500, ₹1,000, ₹2,500, ₹5,000, or Custom).
   - Optional project designation dropdown.
   - Donor details collection (Name, Email, Phone, Address, PAN Number for 80G tax deduction receipt).
2. **Payment Gateway Integration Flow**:
   - Step 1: User submits donation form -> Frontend calls `POST /api/v1/donations/create-order` via `donationApi.js`.
   - Step 2: Backend returns `order_id`, `amount`, `currency`, and `key_id`.
   - Step 3: Frontend dynamically opens payment gateway checkout modal (e.g. Razorpay modal via client SDK).
   - Step 4: On payment completion:
     - Frontend receives `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`.
     - Frontend displays a full-screen loading verification screen ("Verifying payment with Trust records...").
     - Frontend submits verification payload to `POST /api/v1/donations/verify`.
   - Step 5: On backend confirmation:
     - Redirect to `PaymentSuccessPage.jsx` showing donation receipt ID, donor name, amount, and printable 80G receipt voucher.
   - Step 6: If cancelled or rejected:
     - Redirect to `PaymentFailurePage.jsx` with clear reason and "Try Again" option.
3. **Critical Rule for Mrinmayee**:
   - **Never** mark a donation as successful purely based on frontend callback! The UI must always await the authoritative verification response from Suchitra's backend.

### Phase 4: Admin Dashboard & Management UI
1. **Admin Layout (`AdminLayout.jsx`)**:
   - Sidebar navigation: Overview, Projects, Donations, Users, Inquiries, Reports.
   - Header with current admin profile and logout button.
2. **Admin Pages**:
   - `DashboardPage.jsx`: Metrics cards (Total Donations, Donor Count, Active Projects, Pending Inquiries) and recent transactions table.
   - `AdminProjectsPage.jsx`: Data table with search, pagination, "Create Project" modal, and edit/delete actions.
   - `AdminDonationsPage.jsx`: Comprehensive donation ledger with status badges (`COMPLETED`, `PENDING`, `FAILED`), date range picker, and 80G details view.
   - `AdminUsersPage.jsx`: User list with role changer dropdown (`ADMIN`, `STAFF`, `MEMBER`).
   - `AdminInquiriesPage.jsx`: Inbox of submitted contact messages with mark-as-resolved action.
   - `AdminReportsPage.jsx`: Donation summary reports with date filters and CSV/PDF export trigger.

---

## 5. Frontend Definition of Done & Quality Standards

As required by Section 21 of `ANTIGRAVITY_TEAM_RULES.md`, every screen and component created by Mrinmayee must meet:

1. **Four Fundamental UI States**:
   - **Loading State**: Clean spinner or skeleton placeholder while fetching data.
   - **Empty State**: Friendly illustration/message with a call-to-action when lists are empty (e.g., "No projects found in this category").
   - **Error State**: Informative, non-technical error message with a "Retry" button.
   - **Success State**: Immediate visual feedback (toast notifications, confirmation screens).
2. **Form Validation**:
   - Input validation before API dispatch (required fields, valid email, 10-digit Indian phone number, valid PAN format).
   - Clear inline error messages below invalid fields.
   - Disabled submit button while request is in-flight.
3. **Responsiveness & Cross-Device Compatibility**:
   - Fully responsive on Mobile (360px+), Tablet (768px+), and Desktop (1024px+).
   - Mobile-friendly touch targets (min 44px) and collapsible navigation drawer.
4. **Security & Secrets Rule**:
   - **Zero payment gateway secret keys in frontend code**. Only publishable keys (e.g., `VITE_PAYMENT_GATEWAY_KEY`) are permitted.
   - Client-side auth checks (`ProtectedRoute`) protect user experience; backend RBAC remains the true authority.
5. **Build Verification**:
   - Must build cleanly without errors: `npm run build`.
