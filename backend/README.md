# Retain — Backend API

REST API for **Retain**, a personal expense and budget management application. Handles authentication, expense tracking, monthly budgets, category management, and platform analytics.

Built with Node.js, Express, and MongoDB.

---

## 🔗 Links

- **Frontend repo:** _[to be added after frontend setup]_
- **Frontend (live):** _[to be added after deployment]_
- **Backend API (live):** _[to be added after deployment]_

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 4 |
| Database | MongoDB Atlas (Mongoose 8) |
| Authentication | JSON Web Tokens (JWT) |
| Password hashing | bcryptjs |
| Dev tooling | nodemon |

---

## ✨ Features

### Authentication & Authorization
- Sign up with name, email, and password
- Sign in returning a JWT (7-day expiry)
- Passwords hashed with bcrypt — never stored in plaintext
- Role-based access control (`user` / `admin`)
- Protected routes via `protect` middleware
- Admin-only routes via `adminOnly` middleware

### Expenses
- Full CRUD (create, read, update, delete)
- Each expense stores: title, amount, category, payment method, date, optional notes
- All expenses scoped to the authenticated user (no cross-user access)
- Filtering by:
  - Text search on title
  - Category
  - Payment method
  - Date range (start/end)
  - Amount range (min/max)
- Sorting by date or amount (ascending / descending)
- Pagination with page and limit

### Budgets
- Set a monthly budget per user
- Get budget summary for a month:
  - Budget amount
  - Total spent this month
  - Remaining
  - Status: `within` (< 80% used), `approaching` (80–99%), `over` (≥ 100%)
- One budget per user per month (enforced by unique index)

### User Dashboard
- Aggregated summary for a month:
  - Total spent
  - Budget amount and remaining
  - Highest single expense
  - Spending grouped by category
  - 5 most recent expenses

### Admin
- Full category CRUD
- **Safe category deletion:** if a category has expenses, they are automatically reassigned to a default `Uncategorized` category before deletion
- The default category itself cannot be deleted
- Platform insights:
  - Total registered users
  - Total expenses recorded
  - Total value of all expenses
  - Number of expenses in the current month
  - Total spending per category
  - Top 5 and bottom 5 categories by usage count
  - Recently added expenses
  - Recently registered users

---

## 📁 Project Structure

    retain-backend/
    ├── src/
    │   ├── server.js                 # Express app entry point
    │   ├── middleware/
    │   │   └── auth.js               # protect + adminOnly
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Category.js
    │   │   ├── Expense.js
    │   │   └── Budget.js
    │   ├── routes/
    │   │   ├── auth.js               # signup / signin / me
    │   │   ├── categories.js         # list categories for users
    │   │   ├── expenses.js           # CRUD + filters + pagination
    │   │   ├── budgets.js            # monthly budget logic
    │   │   ├── dashboard.js          # user dashboard aggregation
    │   │   └── admin.js              # category admin + insights
    │   └── scripts/
    │       └── seed.js               # creates admin + default category
    ├── .env                          # local secrets (not committed)
    ├── .gitignore
    ├── package.json
    └── README.md

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (free tier works)
- npm

### 1. Clone the repository

    git clone https://github.com/Rwema01/retain-backend.git
    cd retain-backend

### 2. Install dependencies

    npm install

### 3. Create a `.env` file

In the project root, create `.env` with:

    PORT=5000
    MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/retain?retryWrites=true&w=majority
    JWT_SECRET=replace_this_with_a_long_random_string
    CLIENT_URL=http://localhost:5173

**Variable reference:**

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (5000 locally) |
| `MONGO_URI` | MongoDB Atlas connection string, ending in a database name |
| `JWT_SECRET` | Long random string used to sign tokens |
| `CLIENT_URL` | Frontend origin allowed by CORS |

### 4. Seed the database

    npm run seed

This creates:

- A default `Uncategorized` category
- An admin user (email `admin@retain.com`, password `admin1234`)
- Optional starter categories (Food, Transport, Rent, Utilities, Entertainment)

The script is idempotent — running it again will not duplicate anything.

### 5. Start the dev server

    npm run dev

Server runs at `http://localhost:5000`. Health check: `GET /api/health`.

---

## 🔐 Environment Variables

See the table above. **Never commit `.env` to version control** — it is already listed in `.gitignore`.

---

## 📡 API Reference

Base URL (local): `http://localhost:5000/api`  
Base URL (deployed): _[to be added]_

All endpoints except `/health`, `/auth/signup`, and `/auth/signin` require an `Authorization: Bearer <token>` header.

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | Public | Health check |

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | Public | Register a new user |
| POST | `/auth/signin` | Public | Sign in, receive a JWT |
| GET | `/auth/me` | User | Get current authenticated user |

**POST `/auth/signup` — body:**

    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "secret123"
    }

**Response:**

    {
      "token": "eyJhbGciOi...",
      "user": {
        "_id": "...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      }
    }

### Categories (read-only for users)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/categories` | User | List all categories |

### Expenses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/expenses` | User | List with filters + pagination |
| POST | `/expenses` | User | Create |
| GET | `/expenses/:id` | User | Read one |
| PUT | `/expenses/:id` | User | Update |
| DELETE | `/expenses/:id` | User | Delete |

**Query parameters for `GET /expenses`:**

| Param | Example | Description |
|---|---|---|
| `search` | `lunch` | Case-insensitive title match |
| `category` | `<ObjectId>` | Filter by category ID |
| `paymentMethod` | `card` | One of `cash`, `card`, `upi`, `bank`, `other` |
| `startDate` | `2026-10-01` | Include expenses on or after |
| `endDate` | `2026-10-31` | Include expenses on or before |
| `minAmount` | `10` | Minimum amount |
| `maxAmount` | `100` | Maximum amount |
| `sortBy` | `amount` | `date` (default) or `amount` |
| `order` | `asc` | `desc` (default) or `asc` |
| `page` | `2` | 1-based page number (default 1) |
| `limit` | `20` | Items per page (default 10, max 100) |

**Response shape:**

    {
      "items": [ ... ],
      "total": 42,
      "page": 1,
      "pages": 5,
      "limit": 10
    }

### Budgets

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/budgets/:month` | User | Get budget + spending for a month |
| PUT | `/budgets/:month` | User | Create or update budget |

`:month` must be in `YYYY-MM` format, e.g. `2026-10`.

**GET response:**

    {
      "month": "2026-10",
      "amount": 500,
      "totalSpent": 123.45,
      "remaining": 376.55,
      "status": "within"
    }

`status` is one of `within`, `approaching`, or `over`.

### User Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard?month=YYYY-MM` | User | Summary for the user's month |

**Response:**

    {
      "month": "2026-10",
      "totalSpent": 123.45,
      "budget": 500,
      "remaining": 376.55,
      "highestExpense": { ... },
      "byCategory": { "Food": 45.2, "Transport": 30.0 },
      "recentExpenses": [ ... ]
    }

### Admin — Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/admin/categories` | Admin | Create a category |
| PUT | `/admin/categories/:id` | Admin | Update a category |
| DELETE | `/admin/categories/:id` | Admin | Delete a category (expenses reassigned) |

**DELETE behavior:**

- Cannot delete the default category
- All expenses in the deleted category are reassigned to `Uncategorized`
- Response: `{ "message": "Category deleted", "reassignedExpenses": 3, "movedTo": "Uncategorized" }`

### Admin — Insights

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/insights` | Admin | Platform-wide statistics |

Response fields: `totalUsers`, `totalExpenses`, `totalValue`, `currentMonthCount`, `spendingPerCategory`, `top5`, `bottom5`, `recentExpenses`, `recentUsers`.

---

## 🧪 Testing the API

You can test endpoints with curl, Postman, Thunder Client, or any REST client.

Example — sign in and get a token:

    curl -X POST http://localhost:5000/api/auth/signin \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@retain.com","password":"admin1234"}'

Then use the returned `token` in subsequent requests:

    curl http://localhost:5000/api/admin/insights \
      -H "Authorization: Bearer <paste_token_here>"

---

## 🔑 Development Admin Credentials

The seed script creates an admin user for testing:

- **Email:** `admin@retain.com`
- **Password:** `admin1234`

⚠️ These are development credentials only. Change them before any public deployment.

---

## 🗄 Data Model Overview

### User
- `name` (string)
- `email` (string, unique, lowercase)
- `password` (string, hashed with bcrypt)
- `role` (`"user"` or `"admin"`)
- `timestamps`

### Category
- `name` (string, unique)
- `icon` (string, optional emoji)
- `isDefault` (boolean — only one category should be marked `true` for `Uncategorized`)
- `timestamps`

### Expense
- `user` (ObjectId → User)
- `title` (string)
- `amount` (number, ≥ 0)
- `category` (ObjectId → Category)
- `paymentMethod` (`cash` | `card` | `upi` | `bank` | `other`)
- `date` (Date)
- `notes` (string, optional)
- `timestamps`
- Compound index: `{ user: 1, date: -1 }`

### Budget
- `user` (ObjectId → User)
- `month` (string, format `YYYY-MM`)
- `amount` (number, ≥ 0)
- `timestamps`
- Unique index: `{ user: 1, month: 1 }`

---

## 🚢 Deployment

Deployed on Render (free tier) with MongoDB Atlas as the managed database.

**Deployment checklist:**

1. Push code to GitHub
2. Create a Web Service on Render pointing at this repository
3. Set environment variables in Render (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`)
4. Build command: `npm install`
5. Start command: `npm start`
6. After first deploy, run the seed script via Render's shell: `npm run seed`
7. In MongoDB Atlas → Network Access, add `0.0.0.0/0` to allow connections from Render's rotating IPs

---

## 📝 Author

**Rwema Gisa**  
GitHub: [@Rwema01](https://github.com/Rwema01)

---

## 📄 License

ISC