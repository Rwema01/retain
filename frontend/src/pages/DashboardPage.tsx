import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import api from "../services/api";
import type { DashboardData } from "../types";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

export default function DashboardPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [appliedMonth, setAppliedMonth] = useState(month);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<DashboardData>(`/dashboard?month=${appliedMonth}`)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [appliedMonth]);

  if (loading || !data) {
    return <div className="p-6 text-[#b8d4b8]">Loading dashboard…</div>;
  }

  const catData = Object.entries(data.byCategory).map(([name, value]) => ({
    name,
    value: Number(value),
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-[#b8d4b8]">
            Overview for the selected month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-rim bg-elevated text-ink rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={() => setAppliedMonth(month)}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-950 transition"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-rim rounded-xl p-5">
          <p className="text-sm text-ink-muted">Total Spent</p>
          <p className="text-3xl font-bold text-ink mt-1">
            ${data.totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="bg-card border border-rim rounded-xl p-5">
          <p className="text-sm text-ink-muted">Remaining Budget</p>
          <p
            className={`text-3xl font-bold mt-1 ${data.remaining < 0 ? "text-red-400" : "text-accent"
              }`}
          >
            ${data.remaining.toFixed(2)}
          </p>
          <p className="text-xs text-ink-muted/70 mt-1">
            Budget: ${data.budget.toFixed(2)}
          </p>
        </div>
        <div className="bg-card border border-rim rounded-xl p-5">
          <p className="text-sm text-ink-muted">Highest Expense</p>
          <p className="text-3xl font-bold text-ink mt-1">
            {data.highestExpense
              ? `$${data.highestExpense.amount.toFixed(2)}`
              : "—"}
          </p>
          {data.highestExpense && (
            <p className="text-xs text-ink-muted/70 mt-1 truncate">
              {data.highestExpense.title}
            </p>
          )}
        </div>
      </div>

      {/* Chart + recent expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-rim rounded-xl p-5">
          <h2 className="font-bold text-ink mb-3">Spending by Category</h2>
          {catData.length === 0 ? (
            <p className="text-ink-muted text-sm py-8 text-center">
              No expenses this month.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={catData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={45}
                  paddingAngle={2}
                >
                  {catData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #1a4a1a",
                    background: "#0a2a0a",
                    color: "#ffffff",
                    fontSize: 13,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={44}
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ color: "#0f172a", fontSize: 14, fontWeight: 500 }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card border border-rim rounded-xl p-5">
          <h2 className="font-bold text-ink mb-3">Recent Expenses</h2>
          {data.recentExpenses.length === 0 ? (
            <p className="text-ink-muted text-sm py-8 text-center">
              No recent expenses.
            </p>
          ) : (
            <ul className="divide-y divide-rim">
              {data.recentExpenses.map((e) => (
                <li
                  key={e._id}
                  className="py-3 flex justify-between items-center gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink truncate">{e.title}</p>
                    <p className="text-xs text-ink-muted">
                      {e.category?.icon} {e.category?.name} •{" "}
                      {new Date(e.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-semibold text-ink whitespace-nowrap">
                    ${e.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}