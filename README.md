# Retain — Personal Expense & Budget Manager

A full-stack web application for tracking personal expenses and managing monthly budgets.

## 🔗 Live Application

- **Frontend (live):** _[to be added after deployment]_
- **Backend API (live):** _[to be added after deployment]_

## 📁 Repository Structure

    retain/
    ├── backend/       # REST API — Node.js + Express + MongoDB
    ├── frontend/      # Web client — React + TypeScript + Vite
    └── README.md      # This file

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Redux Toolkit, React Context, React Router, Recharts, Tailwind CSS |
| Backend | Node.js, Express, MongoDB Atlas, Mongoose, JWT |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## ✨ Features

### User
- Sign up, sign in, sign out
- Create, view, update, and delete personal expenses
- Filter and search expenses by category, payment method, date, and amount
- Sort expenses by date or amount
- Set a monthly budget and track remaining amount
- Budget status: within, approaching, or over
- User dashboard with total spending, remaining budget, highest expense, spending breakdown by category, and recent expenses

### Admin
- Full category management (create, update, delete)
- Safe category deletion — expenses are reassigned to a default `Uncategorized` category
- Platform insights: user count, expense count, total value, monthly activity, top/bottom categories, recent users and expenses

## 🚀 Getting Started

Each part of the project has its own detailed README:

- **Backend:** see [backend/README.md](./backend/README.md)
- **Frontend:** see [frontend/README.md](./frontend/README.md)

### Quick start

Backend:

    cd backend
    npm install
    # create .env file (see backend/README.md)
    npm run seed
    npm run dev

Frontend:

    cd frontend
    npm install
    # create .env file (see frontend/README.md)
    npm run dev

## 👤 Author

**Rwema Gisa**
GitHub: [@Rwema01](https://github.com/Rwema01)

## 📄 License

ISC
