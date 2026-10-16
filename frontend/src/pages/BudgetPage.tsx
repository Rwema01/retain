import { useEffect, useState } from "react";
import api from "../services/api";
import type { BudgetInfo } from "../types";

export default function BudgetPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [appliedMonth, setAppliedMonth] = useState(month);
  const [info, setInfo] = useState<BudgetInfo | null>(null);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async (m: string) => {
    const { data } = await api.get<BudgetInfo>(`/budgets/${m}`);
    setInfo(data);
    setAmount(String(data.amount || ""));
  };

  useEffect(() => {
    setMessage("");
    load(appliedMonth).catch(() => setMessage("Failed to load budget"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedMonth]);

  const handleSave = async () => {
    const parsed = Number(amount);
    if (isNaN(parsed) || parsed < 0) {
      setMessage("Please enter a valid non-negative amount");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await api.put(`/budgets/${appliedMonth}`, { amount: parsed });
      await load(appliedMonth);
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

  const inputClass =
    "bg-white text-black placeholder:text-gray-500 border border-rim rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  if (!info) {
    return <div className="p-6 text-[#b8d4b8]">Loading budget…</div>;
  }

  const pct =
    info.amount > 0 ? Math.min((info.totalSpent / info.amount) * 100, 100) : 0;

  const statusStyles: Record<
    string,
    { bar: string; text: string; label: string }
  > = {
    within: {
      bar: "bg-green-500",
      text: "text-green-400",
      label: "✓ Within budget",
    },
    approaching: {
      bar: "bg-amber-500",
      text: "text-amber-400",
      label: "⚠ Approaching limit",
    },
    over: {
      bar: "bg-red-500",
      text: "text-red-400",
      label: "⚠ Over budget",
    },
  };

  const s = statusStyles[info.status];

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-white">Monthly Budget</h1>

      <div className="bg-card border border-rim rounded-xl p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Month
          </label>
          <div className="flex gap-2">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={inputClass}
            />
            <button
              onClick={() => setAppliedMonth(month)}
              className="bg-blue-950 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-500 transition"
            >
              Apply
            </button>
          </div>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-sm font-medium text-ink mb-1">
            Budget amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${inputClass} w-full`}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-500 disabled:opacity-50 transition"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {message && (
        <p className="text-sm text-ink-muted bg-card border border-rim rounded-lg p-3">
          {message}
        </p>
      )}

      <div className="bg-card border border-rim rounded-xl p-5 space-y-4">
        <div className="flex justify-between flex-wrap gap-2 text-sm">
          <span className="text-ink-muted">
            Spent:{" "}
            <span className="font-semibold text-ink">
              ${info.totalSpent.toFixed(2)}
            </span>
          </span>
          <span className="text-ink-muted">
            Budget:{" "}
            <span className="font-semibold text-ink">
              ${info.amount.toFixed(2)}
            </span>
          </span>
          <span className="text-ink-muted">
            Remaining:{" "}
            <span
              className={`font-semibold ${info.remaining < 0 ? "text-red-400" : "text-ink"
                }`}
            >
              ${info.remaining.toFixed(2)}
            </span>
          </span>
        </div>

        <div className="w-full bg-elevated rounded-full h-3 overflow-hidden">
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