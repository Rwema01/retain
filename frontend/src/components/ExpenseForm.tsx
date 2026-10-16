import { useState, type FormEvent } from "react";
import api from "../services/api";
import type {
  Category,
  Expense,
  ExpensePayload,
  PaymentMethod,
} from "../types";

interface Props {
  categories: Category[];
  expense: Expense | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ExpenseForm({
  categories,
  expense,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<ExpensePayload>({
    title: expense?.title ?? "",
    amount: expense?.amount ?? 0,
    category: expense?.category?._id ?? categories[0]?._id ?? "",
    paymentMethod: expense?.paymentMethod ?? "card",
    date: expense?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    notes: expense?.notes ?? "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (expense) {
        await api.put(`/expenses/${expense._id}`, form);
      } else {
        await api.post("/expenses", form);
      }
      onSaved();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to save expense";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-white text-black placeholder:text-gray-500 border border-rim rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-rim rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl"
      >
        <h2 className="text-xl font-bold text-ink">
          {expense ? "Edit Expense" : "Add Expense"}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
            placeholder="Lunch at cafe"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Amount
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: Number(e.target.value) })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Date
            </label>
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Category
            </label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Payment
            </label>
            <select
              required
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({
                  ...form,
                  paymentMethod: e.target.value as PaymentMethod,
                })
              }
              className={inputClass}
            >
              {["cash", "card", "upi", "bank", "other"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Notes (optional)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className={inputClass}
            placeholder="Optional notes"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-rim text-ink-muted hover:bg-elevated hover:text-ink transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-blue-950 text-white font-medium hover:bg-emerald-500 disabled:opacity-50 transition"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}