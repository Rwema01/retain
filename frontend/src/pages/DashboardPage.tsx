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
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#84cc16", // lime
];

export default function DashboardPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<DashboardData>(`/dashboard?month=${month}`)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [month]);

  if (loading || !data) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-slate-500">
        Loading dashboard…
      </div>
    );
  }

  const catData = Object.entries(data.byCategory).map(([name, value]) => ({
    name,
    value: Number(value),
  }));

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Overview for the selected month
          </p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-slate-500">Total Spent</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            ${data.totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-slate-500">Remaining Budget</p>
          <p
            className={`text-3xl font-bold mt-1 ${
              data.remaining < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            ${data.remaining.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Budget: ${data.budget.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-slate-500">Highest Expense</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            {data.highestExpense
              ? `$${data.highestExpense.amount.toFixed(2)}`
              : "—"}
          </p>
          {data.highestExpense && (
            <p className="text-xs text-slate-400 mt-1 truncate">
              {data.highestExpense.title}
            </p>
          )}
        </div>
      </div>

      {/* Chart + recent expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-slate-800 mb-3">
            Spending by Category
          </h2>
          {catData.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">
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
                    border: "1px solid #e2e8f0",
                    fontSize: 13,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ color: "#475569", fontSize: 12 }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent expenses */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-slate-800 mb-3">Recent Expenses</h2>
          {data.recentExpenses.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">
              No recent expenses.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.recentExpenses.map((e) => (
                <li
                  key={e._id}
                  className="py-3 flex justify-between items-center gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">
                      {e.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {e.category?.icon} {e.category?.name} •{" "}
                      {new Date(e.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-semibold text-slate-800 whitespace-nowrap">
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