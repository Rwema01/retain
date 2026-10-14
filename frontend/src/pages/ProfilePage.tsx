import { useState, type FormEvent } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

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
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Profile</h1>

      <form
        onSubmit={handleProfile}
        className="bg-white rounded-xl shadow-sm p-5 space-y-4"
      >
        <h2 className="font-bold text-slate-800">Personal Information</h2>

        {profileMessage && (
          <p className="text-sm text-green-700 bg-green-50 rounded-lg p-3">
            {profileMessage}
          </p>
        )}
        {profileError && (
          <p className="text-sm text-red-700 bg-red-50 rounded-lg p-3">
            {profileError}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {savingProfile ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>

      <form
        onSubmit={handlePassword}
        className="bg-white rounded-xl shadow-sm p-5 space-y-4"
      >
        <h2 className="font-bold text-slate-800">Change Password</h2>

        {passwordMessage && (
          <p className="text-sm text-green-700 bg-green-50 rounded-lg p-3">
            {passwordMessage}
          </p>
        )}
        {passwordError && (
          <p className="text-sm text-red-700 bg-red-50 rounded-lg p-3">
            {passwordError}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Current password
          </label>
          <input
            required
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            New password
          </label>
          <input
            required
            type="password"
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingPassword}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900 disabled:opacity-50 transition"
          >
            {savingPassword ? "Updating…" : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}