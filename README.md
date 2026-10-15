# Retain — Frontend

React + TypeScript client for **Retain**, a personal expense and budget management application. Talks to the Retain backend API.

---

## 🔗 Links

- **Backend repo:** [github.com/Rwema01/retain/tree/main/backend](https://github.com/Rwema01/retain/tree/main/backend)
- **Backend API (live):** _[to be added after deployment]_
- **Frontend (live):** _[to be added after deployment]_

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Global state (filters) | Redux Toolkit + React Redux |
| Auth state | React Context |
| HTTP client | Axios |
| Charts | Recharts |

---

## ✨ Features

### Authentication & Authorization
- Sign up, sign in, sign out
- JWT stored in `localStorage`
- Auth state managed by React Context
- Protected routes via a `ProtectedRoute` wrapper
- Role-based access (admin vs. user)

### Expenses
- Full CRUD from a modal form
- Live search with 300ms debounce
- Advanced filters (date range, amount range) with explicit Apply
- Quick filters (category, payment method, sort) applied live
- Sort by date or amount, ascending or descending
- Pagination

### Budgets
- Set a monthly budget
- Progress bar with color-coded status (`within` / `approaching` / `over`)

### Dashboard
- Month picker
- Total spent, remaining budget, highest expense cards
- Pie chart of spending by category
- Recent expenses list

### Admin
- Category management (add, rename, delete)
- Safe delete — expenses reassigned to Uncategorized
- Platform insights: user/expense counts, total value, current-month activity, top/bottom categories, recent activity

### Profile
- Update name and email
- Change password

### Redux Usage
- The `filters` slice stores search, filters, sorting, and pagination
- Matches the assignment requirement that filtering/sorting/search live in Redux

---

## 📁 Project Structure

    frontend/
    ├── src/
    │   ├── components/         # Reusable UI
    │   │   ├── ExpenseForm.tsx
    │   │   ├── Navbar.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── hooks/
    │   │   └── useDebounce.ts
    │   ├── pages/
    │   │   ├── AdminPage.tsx
    │   │   ├── BudgetPage.tsx
    │   │   ├── DashboardPage.tsx
    │   │   ├── ExpensesPage.tsx
    │   │   ├── ProfilePage.tsx
    │   │   ├── SignInPage.tsx
    │   │   └── SignUpPage.tsx
    │   ├── redux/
    │   │   ├── filtersSlice.ts
    │   │   ├── hooks.ts
    │   │   └── store.ts
    │   ├── services/
    │   │   └── api.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── .env
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- The Retain backend running locally (see [backend README](../backend/README.md))

### 1. Install dependencies

    npm install

### 2. Configure environment

Create `.env` in this folder with:

    VITE_API_URL=http://localhost:5000/api

The frontend reads this at build time. Restart the dev server after changing it.

### 3. Run the dev server

    npm run dev

Opens at `http://localhost:5173`.

---

## 🔐 Test Credentials

Use the seeded admin to explore admin features:

- **Email:** `admin@retain.com`
- **Password:** `admin1234`

Or sign up a fresh user from `/signup`.

---

## 🧪 What to Try

1. Sign in and land on the Dashboard
2. Add an expense from the Expenses page
3. Try live search, category filters, advanced filters with Apply, and sorting
4. Set a monthly budget and watch the status bar change color
5. Sign in as the seeded admin and open the Admin page
6. Add a category, rename it, then delete it — watch expenses reassign to Uncategorized
7. Update your profile from the dropdown menu

---

## 🚢 Deployment

Deployed on Vercel.

**Deployment checklist:**

1. Push to GitHub
2. Import the repo on Vercel
3. Set **Root Directory** to `frontend`
4. Add environment variable `VITE_API_URL` pointing at the deployed backend
5. Deploy

Vite will produce a static build output in `dist/`.

---

## 📝 Author

**Rwema Gisa**
GitHub: [@Rwema01](https://github.com/Rwema01)

---

## 📄 License

ISC