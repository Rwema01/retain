import { useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Navbar() {
  const { user, signout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const handleSignout = () => {
    setMenuOpen(false);
    signout();
    navigate("/signin");
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/expenses?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 px-4 md:px-6 py-3">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
        <Link to="/" className="font-bold text-xl text-blue-600 mr-2">
          Retain
        </Link>

        <div className="flex items-center gap-1 flex-wrap">
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/expenses" className={linkClass}>
            Expenses
          </NavLink>
          <NavLink to="/budget" className={linkClass}>
            Budget
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </div>

        {/* Global search — equal heights on input + button */}
        <form
          onSubmit={handleSearch}
          className="ml-auto hidden md:flex items-stretch h-9 rounded-lg overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500"
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses…"
            className="px-3 text-sm w-48 bg-white focus:outline-none"
          />
          <button
            type="submit"
            className="bg-slate-800 text-white px-3 text-sm hover:bg-slate-900 transition"
          >
            Go
          </button>
        </form>

        {/* Profile dropdown */}
        <div className="relative ml-auto md:ml-3">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
              {initials(user.name)}
            </span>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-800 leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 capitalize leading-tight">
                {user.role}
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-slate-400 transition ${
                menuOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}