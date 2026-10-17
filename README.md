# Retain — Personal Expense & Budget Manager

A full-stack web application for tracking personal expenses and managing monthly budgets.

**Live Demo:** [https://retain-alpha.vercel.app](https://retain-alpha.vercel.app)

---

## 🔗 Live Application

- **Frontend (live):** https://retain-alpha.vercel.app
- **Backend API (live):** https://retain-backend-3fxt.onrender.com

> **Note:** The backend runs on Render's free tier, which sleeps after 15 minutes of inactivity. The first request after idling may take 30-50 seconds to wake up. Subsequent requests are instant.

---

## 🔑 Demo Credentials

**Admin (pre-populated with sample data):**
- Email: `admin@example.com`
- Password: `test1234`

**Seeded admin (fresh account):**
- Email: `admin@retain.com`
- Password: `admin1234`

You can also sign up a fresh user from `/signup`.

---

## 📁 Repository Structure

    retain/
    ├── backend/       # REST API — Node.js + Express + MongoDB
    ├── frontend/      # Web client — React + TypeScript + Vite
    └── README.md      # This file

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Redux Toolkit, React Context, React Router, Recharts, Tailwind CSS |
| Backend | Node.js, Express, MongoDB Atlas, Mongoose, JWT |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---

## ✨ Features

### User
- Sign up, sign in, sign out
- Create, view, update, and delete personal expenses
- Filter and search expenses by category, payment method, date, and amount
- Sort expenses by date or amount
- Set a monthly budget and track remaining amount
- Budget status: within, approaching, or over (color-coded progress bar)
- User dashboard with total spending, remaining budget, highest expense, spending-by-category chart, and recent expenses
- Profile management: update name, email, and password (with show/hide toggle)

### Admin
- Full category management (create, rename, delete)
- Safe category deletion — expenses are reassigned to the default `Uncategorized` category
- Platform insights: user count, expense count, total value, monthly activity, top/bottom 5 categories, recent users, and recent expenses

### Technical Highlights
- **Authentication:** React Context + JWT stored in `localStorage`
- **Filtering state:** Redux Toolkit (search, filters, sort, pagination all managed in Redux)
- **Type safety:** Full TypeScript coverage of components, props, Redux state, API responses, and admin data
- **Responsive UI:** Mobile (hamburger menu + slide-in sidebar), tablet, and desktop layouts
- **Protected routes:** `ProtectedRoute` wrapper with role-based access (user vs admin)
- **Debounced search:** 300ms debounce to reduce API calls

---

## 🚀 Getting Started

Each part of the project has its own detailed README:

- **Backend:** see [backend/README.md](./backend/README.md)
- **Frontend:** see [frontend/README.md](./frontend/README.md)

### Quick start

**Backend:**

    cd backend
    npm install
    # create .env file (see backend/README.md)
    npm run seed
    npm run dev

**Frontend:**

    cd frontend
    npm install
    # create .env file (see frontend/README.md)
    npm run dev

---

## 🧪 What to Try

1. Sign in as the admin (credentials above) and land on the Dashboard
2. Add a new expense from the Expenses page
3. Use the search bar, category filter, date range filter, and sorting
4. Set a monthly budget and watch the progress bar change color
5. Open the Admin page — try adding, renaming, and deleting categories
6. Delete a category with expenses — watch them reassign to Uncategorized
7. Update your profile from the top-right profile chip
8. Resize the browser to see the responsive layout (hamburger menu on mobile)

---

## 🧠 Reflections

Going into this project, I expected the coding to be the hardest part. It wasn't. Deployment was.

Locally, everything just worked — until I tried to put it on the internet. MongoDB Atlas refused connections from Render's servers. The frontend couldn't talk to the backend because CORS hadn't been configured for the Vercel URL. Port 5000 was silently hijacked by macOS AirPlay on my own machine. Each of these problems only appeared in production, and each one taught me something textbooks can't.

The second thing I learned was that structure pays off. Keeping the backend and frontend in one repository with separate, well-documented READMEs made deploying each service to its own host (Render, Vercel) straightforward. When something broke, I knew exactly which folder to open.

If I rebuilt this from scratch, I would write tests earlier and add a shared `types/` package between frontend and backend so both sides stayed in sync automatically. I would also not use free-tier hosting for demos — the 15-minute sleep delay is a real UX cost.

What I'm most proud of is that a stranger can now visit the live URL, sign up, log expenses, watch their budget change color, and — if they're an admin — manage categories and see platform-wide insights. The features work end-to-end, not just on my laptop.

---

## 👤 Author

**Rwema Gisa**  
GitHub: [@Rwema01](https://github.com/Rwema01)

---

## 📄 License

ISC