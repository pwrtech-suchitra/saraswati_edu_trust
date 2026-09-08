# Saraswati Educational & Charitable Trust (SECT) Web Application

A secure, scalable web platform for **Saraswati Educational & Charitable Trust (SECT)** — an Indian Public Charitable Trust empowering rural and underserved communities through education, renewable energy, sustainable livelihood, and environmental restoration.

## 🚀 Repository Structure

```text
SECT/
├── frontend/                     # React + Vite client-side application (Mrinmayee)
│   ├── src/
│   │   ├── api/                 # Centralized Axios client & services
│   │   ├── components/          # Common primitives, cards, donation flow, layouts
│   │   ├── context/             # AuthContext (JWT) & NotificationContext (toasts)
│   │   ├── pages/               # Public, Auth, and Admin Management screens
│   │   └── styles/              # Bespoke Philanthropic Design System (index.css)
│   ├── .env.example
│   └── package.json
├── backend/                      # Node.js & Express REST API (Suchitra)
├── database/                     # PostgreSQL migrations & schemas (Suchitra)
├── ANTIGRAVITY_TEAM_RULES.md     # Team contracts and development rules
├── mrinmayee-frontend-plan.md    # Frontend architecture and integration plan
└── suchitra-backend-plan.md      # Backend architecture and API specification
```

## 💻 Frontend Setup (Mrinmayee's Module)

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Getting Started

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000/`.

5. Build for production:
   ```bash
   npm run build
   ```

## 👥 Team Ownership
- **Developer 1 (Suchitra):** Backend API (Node.js/Express), PostgreSQL Database, Payment Webhooks.
- **Developer 2 (Mrinmayee):** React Application, UI/UX, API Integration Layer, Donation Flow, Admin UI.
- **Developer 3:** QA, DevOps, Testing & CI/CD.

## 📜 Section 80G Tax Exemption
All donations to SECT qualify for 50% tax deductions under Section 80G of the Indian Income Tax Act. Official certificates (Form 10BE) are generated upon verified transaction completion.
