import { useEffect, useState } from "react";
import api from "../services/api";
import type { BudgetInfo } from "../types";

export default function BudgetPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [info, setInfo] = useState<BudgetInfo | null>(null);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await api.get<BudgetInfo>(`/budgets/${month}`);
    setInfo(data);
    setAmount(String(data.amount || ""));
  };

  useEffect(() => {
    setMessage("");
    load().catch(() => setMessage("Failed to load budget"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const handleSave = async () => {
    const parsed = Number(amount);
    if (isNaN(parsed) || parsed < 0) {
      setMessage("Please enter a valid non-negative amount");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await api.put(`/budgets/${month}`, { amount: parsed });
      await load();
      setMessage("Budget saved ✅");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to save budget";
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!info) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-slate-500">
        Loading budget…
      </div>
    );
  }

  const pct = info.amount > 0 ? Math.min((info.totalSpent / info.amount) * 100, 100) : 0;

  const statusStyles: Record<string, { bar: string; text: string; label: string }> = {
    within: {
      bar: "bg-green-500",
      text: "text-green-700",
      label: "✓ Within budget",
    },
    approaching: {
      bar: "bg-amber-500",
      text: "text-amber-700",
      label: "⚠ Approaching limit",
    },
    over: {
      bar: "bg-red-500",
      text: "text-red-700",
      label: "⚠ Over budget",
    },
  };

  const s = statusStyles[info.status];

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Monthly Budget</h1>

      {/* Month + amount controls */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Month
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Budget amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {message && (
        <p className="text-sm text-slate-600 bg-white rounded-lg shadow-sm p-3">
          {message}
        </p>
      )}

      {/* Summary card */}
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
        <div className="flex justify-between flex-wrap gap-2 text-sm">
          <span className="text-slate-600">
            Spent:{" "}
            <span className="font-semibold text-slate-800">
              ${info.totalSpent.toFixed(2)}
            </span>
          </span>
          <span className="text-slate-600">
            Budget:{" "}
            <span className="font-semibold text-slate-800">
              ${info.amount.toFixed(2)}
            </span>
          </span>
          <span className="text-slate-600">
            Remaining:{" "}
            <span
              className={`font-semibold ${
                info.remaining < 0 ? "text-red-600" : "text-slate-800"
              }`}
            >
              ${info.remaining.toFixed(2)}
            </span>
          </span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 transition-all duration-500 ${s.bar}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <p className={`font-semibold ${s.text}`}>
          {s.label} — {pct.toFixed(1)}% used
        </p>
      </div>
    </div>
  );
}