import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, signout, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSignout = () => {
    signout();
    navigate("/signin");
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

        <div className="ml-auto flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
          </div>
          <button
            onClick={handleSignout}
            className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}