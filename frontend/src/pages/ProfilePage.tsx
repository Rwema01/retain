import { useState, type FormEvent } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";

export default function ProfilePage() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const inputClass =
    "w-full bg-white text-black placeholder:text-gray-500 border border-rim rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  const handleProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");
    setSavingProfile(true);
    try {
      await api.put("/auth/profile", { name, email });
      setProfileMessage("Profile updated ✅ Refresh the page to see the navbar change");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update profile";
      setProfileError(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");
    setSavingPassword(true);
    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      setPasswordMessage("Password updated ✅");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update password";
      setPasswordError(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      <form
        onSubmit={handleProfile}
        className="bg-card border border-rim rounded-xl p-5 space-y-4"
      >
        <h2 className="font-bold text-ink">Personal Information</h2>

        {profileMessage && (
          <p className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg p-3">
            {profileMessage}
          </p>
        )}
        {profileError && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {profileError}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-500 disabled:opacity-50 transition"
          >
            {savingProfile ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>

      <form
        onSubmit={handlePassword}
        className="bg-card border border-rim rounded-xl p-5 space-y-4"
      >
        <h2 className="font-bold text-ink">Change Password</h2>

        {passwordMessage && (
          <p className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg p-3">
            {passwordMessage}
          </p>
        )}
        {passwordError && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {passwordError}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Current password
          </label>
          <PasswordInput
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            New password
          </label>
          <PasswordInput
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <p className="text-xs text-ink-muted mt-1">At least 6 characters</p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingPassword}
            className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-500 disabled:opacity-50 transition"
          >
            {savingPassword ? "Updating…" : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}