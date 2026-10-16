import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, isAdmin, signout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${isActive
      ? "bg-white text-emerald-700"
      : "text-white hover:bg-white hover:text-emerald-700"
    }`;

  const handleSignout = () => {
    onClose();
    signout();
    navigate("/signin");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky md:top-0 left-0 z-40 md:z-auto top-0 h-screen w-64 bg-[#042404] border-r border-[#0d3310] flex flex-col transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="border-b border-[#0d3310]">
          <Logo size="lg" />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavLink to="/" end className={linkClass} onClick={onClose}>
            <span className="text-xl">🏠</span> Dashboard
          </NavLink>
          <NavLink to="/expenses" className={linkClass} onClick={onClose}>
            <span className="text-xl">💸</span> Expenses
          </NavLink>
          <NavLink to="/budget" className={linkClass} onClick={onClose}>
            <span className="text-xl">📊</span> Budget
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkClass} onClick={onClose}>
              <span className="text-xl">👑</span> Admin
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-[#0d3310]">
          <button
            onClick={handleSignout}
            className="w-full flex items-center justify-center gap-2 bg-red-900 hover:bg-red-800 text-white text-base font-medium py-3.5 rounded-lg transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
              />
            </svg>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}