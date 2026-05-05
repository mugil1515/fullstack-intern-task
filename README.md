# ⬡ SaaS Template Store

A full-stack Mini SaaS Template Marketplace built with **React**, **Node.js + Express**, and **MySQL**. Features JWT authentication, role-based access control, a storefront, user dashboard, and an admin panel.

---

## 🗂 Project Structure

```
saas-template-store/
├── backend/                    # Node.js + Express API
│   ├── server.js               # Entry point
│   ├── .env                    # Environment variables
│   ├── .env.example            # Env template
│   ├── .gitignore
│   ├── package.json
│   └── src/
│       ├── app.js              # Express app setup
│       ├── config/
│       │   ├── db.js           # MySQL pool
│       │   └── jwt.js          # JWT config
│       ├── controllers/        # Request handlers
│       │   ├── auth.controller.js
│       │   ├── template.controller.js
│       │   ├── order.controller.js
│       │   └── user.controller.js
│       ├── repositories/       # Database query layer
│       │   ├── user.repository.js
│       │   ├── template.repository.js
│       │   └── order.repository.js
│       ├── services/           # Business logic layer
│       │   ├── auth.service.js
│       │   ├── template.service.js
│       │   └── order.service.js
│       ├── middlewares/
│       │   ├── auth.middleware.js       # JWT verify + role guard
│       │   ├── error.middleware.js      # Global error handler
│       │   ├── notFound.middleware.js
│       │   └── validation.middleware.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── template.routes.js
│       │   ├── order.routes.js
│       │   ├── user.routes.js
│       │   └── admin.routes.js
│       └── utils/
│           ├── jwt.util.js      # Token helpers
│           ├── response.util.js # Unified API responses
│           └── migrate.js       # DB schema migration
│
└── frontend/                   # React SPA
    ├── public/
    │   └── index.html
    ├── .env
    ├── .gitignore
    ├── package.json
    └── src/
        ├── App.jsx             # Routes & providers
        ├── index.js            # React entry point
        ├── styles/
        │   └── globals.css     # CSS variables & resets
        ├── context/
        │   ├── AuthContext.jsx  # Auth state (JWT)
        │   └── ToastContext.jsx # Notifications
        ├── services/           # Axios API calls
        │   ├── api.js          # Axios instance + interceptors
        │   ├── auth.service.js
        │   ├── template.service.js
        │   └── order.service.js
        ├── hooks/
        │   └── useApi.js       # Generic async hook
        ├── utils/
        │   └── helpers.js      # Formatters & utilities
        ├── components/
        │   ├── common/
        │   │   └── ProtectedRoute.jsx
        │   ├── layout/
        │   │   ├── Navbar.jsx / Navbar.css
        │   │   └── Footer.jsx / Footer.css
        │   └── ui/
        │       └── TemplateCard.jsx / TemplateCard.css
        └── pages/
            ├── Auth/
            │   ├── Login.jsx
            │   ├── Register.jsx
            │   └── Auth.css
            ├── Store/
            │   ├── Home.jsx / Home.css
            │   ├── Store.jsx / Store.css
            │   └── TemplateDetail.jsx / TemplateDetail.css
            ├── Dashboard/
            │   └── Dashboard.jsx / Dashboard.css
            └── Admin/
                └── Admin.jsx / Admin.css
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- npm or yarn

---

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 2. Configure Environment

**Backend** — copy `.env.example` to `.env` and fill in your values:

```env
PORT=8080
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root@1245
DB_NAME=saas_template_store

JWT_SECRET=secret@12345678
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000
```

**Frontend** — edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_NAME=TemplateHub
```

---

### 3. Set Up the Database

```bash
# Create DB in MySQL
mysql -u root -p -e "CREATE DATABASE saas_template_store;"

# Run migrations (from backend/)
cd backend
node src/utils/migrate.js
```

---

### 4. Start the Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev     # uses nodemon

# Terminal 2 — Frontend
cd frontend
npm start
```

- **API**: http://localhost:8080
- **Frontend**: http://localhost:3000
- **Health Check**: http://localhost:8080/api/health

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/profile` | Auth |
| POST | `/api/auth/logout` | Auth |

### Templates
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/templates` | Public |
| GET | `/api/templates/:slug` | Public |
| POST | `/api/templates` | Admin |
| PUT | `/api/templates/:id` | Admin |
| DELETE | `/api/templates/:id` | Admin |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/orders` | Auth |
| GET | `/api/orders/my-orders` | Auth |
| GET | `/api/orders` | Admin |
| GET | `/api/orders/stats` | Admin |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| PUT | `/api/users/profile` | Auth |
| PUT | `/api/users/change-password` | Auth |
| GET | `/api/users/my-templates` | Auth |
| GET | `/api/users` | Admin |

---

## 🗄 Database Schema

| Table | Description |
|-------|-------------|
| `users` | User accounts with role (user/admin) |
| `templates` | SaaS templates with pricing & metadata |
| `categories` | Template categories |
| `orders` | Purchase records |
| `user_templates` | Ownership mapping |
| `reviews` | Template ratings & comments |

---

## 🔐 Auth Flow

1. User registers/logs in → receives a **JWT token**
2. Token is stored in `localStorage`
3. All authenticated requests include `Authorization: Bearer <token>`
4. The backend middleware validates the token on every protected route
5. Role-based access: `admin` role required for admin routes

---

## 🛠 Tech Stack

**Backend**
- Node.js + Express
- MySQL 2 (promise-based)
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- express-validator (input validation)
- helmet + cors + rate-limit (security)
- morgan (logging)

**Frontend**
- React 18
- React Router v6
- Axios (HTTP client with interceptors)
- CSS custom properties (no external UI library)

---

## 📦 Make Your First Admin

After registering, update your user's role directly in MySQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Then log in again — the admin panel will appear in the navbar.

---

## 📝 License

MIT — free for personal and commercial use.


CONTACT DETAILS:
NAME: MUGI S,
CONTACT NO : 8939243452,
EMAIL: MUGIL1504@GMAIL.COM

