import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface TopBarProps {
  onMenuClick: () => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/expenses?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  return (
    <header className="sticky top-0 z-20 bg-[#042404]/95 backdrop-blur border-b border-[#0c330f] px-4 md:px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-[#b8d4b8] hover:text-white p-2 -ml-2"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex-1 flex justify-center">
          <form
            onSubmit={handleSearch}
            className="w-full max-w-md flex items-stretch h-10 rounded-lg overflow-hidden border border-[#1a4a1a] focus-within:ring-2 focus-within:ring-emerald-500"
          >
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses…"
              className="flex-1 px-3 text-sm bg-white text-black placeholder:text-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-emerald-500 text-white px-4 text-sm font-medium hover:bg-blue-950 transition"
            >
              Go
            </button>
          </form>
        </div>

        {user && (
          <Link
            to="/profile"
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#123a12] transition"
          >
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-[#001208] text-xs font-semibold flex items-center justify-center">
              {initials(user.name)}
            </span>
            <span className="hidden sm:inline text-sm font-medium text-white">
              {user.name}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}