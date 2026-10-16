import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import PasswordInput from "../components/PasswordInput";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Sign up failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-rim p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4"
      >
        <div className="flex flex-col items-center mb-4 space-y-3">
          <Logo size="lg" variant="inline" />
          <p className="text-ink-muted text-sm">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white text-black placeholder:text-gray-500 rounded-lg px-3 py-2 border border-rim focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white text-black placeholder:text-gray-500 rounded-lg px-3 py-2 border border-rim focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Password
          </label>
          <PasswordInput
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-2.5 rounded-lg font-medium hover:bg-blue-950 disabled:opacity-50 transition"
        >
          {loading ? "Creating account…" : "Sign Up"}
        </button>

        <p className="text-sm text-center text-ink-muted">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-emerald-600 font-semibold hover:text-blue-950 hover:underline transition"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}