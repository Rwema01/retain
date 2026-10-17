# Retain — Frontend

React + TypeScript client for **Retain**, a personal expense and budget management application. Talks to the Retain backend API.

---

## 🔗 Links

- **Backend repo:** [github.com/Rwema01/retain/tree/main/backend](https://github.com/Rwema01/retain/tree/main/backend)
- **Backend API (live):** https://retain-backend-3fxt.onrender.com
- **Frontend (live):** https://retain-alpha.vercel.app

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
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
- Password visibility toggle on all password inputs
- Profile page with name/email update and password change

### Expenses
- Full CRUD from a modal form
- Live search with 300ms debounce
- Advanced filters (date range, amount range) with explicit Apply
- Quick filters (category, payment method, sort) applied live
- Sort by date or amount, ascending or descending
- Pagination

### Budgets
- Set a monthly budget with explicit Apply for month picker
- Progress bar with color-coded status (`within` / `approaching` / `over`)

### Dashboard
- Month picker with Apply button
- Total spent, remaining budget, highest expense cards
- Donut chart of spending by category
- Recent expenses list

### Admin
- Category management (add, rename, delete)
- Safe delete — expenses reassigned to Uncategorized
- Platform insights: user/expense counts, total value, current-month activity, top/bottom categories, recent activity

### Profile
- Update name and email
- Change password (with visibility toggles)

### Redux Usage
- The `filters` slice stores search, filters, sorting, and pagination
- Matches the assignment requirement that filtering/sorting/search live in Redux

### Responsive Design
- Desktop: full sidebar + multi-column grids
- Tablet (~768px): sidebar visible, content adapts
- Mobile (~400px): sidebar hides behind a hamburger menu with backdrop

---

## 📁 Project Structure

    retain/frontend/
    ├── src/
    │   ├── components/         # Reusable UI
    │   │   ├── ExpenseForm.tsx
    │   │   ├── Logo.tsx
    │   │   ├── PasswordInput.tsx
    │   │   ├── ProtectedRoute.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── TopBar.tsx
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

### 1. Clone the repository

    git clone https://github.com/Rwema01/retain.git
    cd retain/frontend

### 2. Install dependencies

    npm install

### 3. Configure environment

Create `.env` in the `frontend/` folder with:

    VITE_API_URL=http://localhost:5000/api

The frontend reads this at build time. Restart the dev server after changing it.

### 4. Run the dev server

    npm run dev

Opens at `http://localhost:5173`.

---

## 🔐 Demo Credentials

Use these accounts on the deployed app:

**Admin (with sample data):**
- **Email:** `admin@example.com`
- **Password:** `test1234`

**Seeded admin (fresh, no data):**
- **Email:** `admin@retain.com`
- **Password:** `admin1234`

**Regular user:**
- **Email:** `user@example.com`
- **Password:** `test1234`

Or sign up a fresh user from `/signup`.

---

## 🧪 What to Try

1. Sign in with `admin@example.com` / `test1234`
2. Land on the Dashboard with sample data loaded
3. Add an expense from the Expenses page
4. Try live search (type "coffee"), category filters, advanced filters with Apply, and sorting
5. Set a monthly budget and watch the status bar change color (green → amber → red)
6. Open the Admin page (only visible to admins)
7. Add a category, rename it, then delete it — watch expenses reassign to Uncategorized
8. Update your profile from the top bar
9. Resize the browser to mobile width (~400px) — sidebar hides behind a hamburger menu

---

## 🚢 Deployment

Deployed on **Vercel** (Hobby free tier).

**Deployment checklist:**

1. Push code to GitHub (this repo uses a monorepo structure — frontend lives in `frontend/`).
2. Import the `retain` repo on Vercel.
3. Set **Root Directory** to `frontend`.
4. Framework Preset auto-detects **Vite**.
5. Add environment variable:
   - **`VITE_API_URL`** = `https://retain-backend-3fxt.onrender.com/api`
6. Click **Deploy**.

Vite produces a static build output in `dist/`.

**Post-deployment:**
- After Vercel assigns the production URL (e.g. `https://retain-alpha.vercel.app`), update the backend's `CLIENT_URL` environment variable on Render so CORS allows requests from the frontend.
- Redeploy the backend on Render for the CORS change to take effect.

**Note on free tier:** Render backend sleeps after 15 minutes of inactivity. First request after sleep takes 30-50 seconds (cold start). Subsequent requests are fast.

---

## 🎨 Design

The app uses a custom dark green theme built on Tailwind CSS 4 theme tokens:

- **Page background:** `#001208` (deep green-black)
- **Sidebar / Top bar:** `#042404` (dark green)
- **Cards:** white
- **Accent color:** emerald (`#10b981` → hover `#059669`)
- **Sign out:** red with power icon

All colors are defined in `src/index.css` via `@theme` — changing them there updates the entire app.

---

## 📝 Author

**Rwema Gisa**
GitHub: [@Rwema01](https://github.com/Rwema01)

---

## 📄 License

ISC