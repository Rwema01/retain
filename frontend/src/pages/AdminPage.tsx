import { useEffect, useState } from "react";
import api from "../services/api";
import type { AdminInsights, Category } from "../types";

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [insights, setInsights] = useState<AdminInsights | null>(null);
  const [newCat, setNewCat] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [c, i] = await Promise.all([
        api.get<Category[]>("/categories"),
        api.get<AdminInsights>("/admin/insights"),
      ]);
      setCategories(c.data);
      setInsights(i.data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to load admin data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addCategory = async () => {
    if (!newCat.trim()) return;
    setMessage("");
    setError("");
    try {
      await api.post("/admin/categories", { name: newCat.trim() });
      setNewCat("");
      setMessage("Category added ✅");
      await load();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to add category";
      setError(msg);
    }
  };

  const renameCategory = async (id: string, name: string) => {
    if (!name.trim()) return;
    setMessage("");
    setError("");
    try {
      await api.put(`/admin/categories/${id}`, { name: name.trim() });
      setMessage("Category updated ✅");
      await load();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update category";
      setError(msg);
    }
  };

  const deleteCategory = async (id: string, name: string) => {
    if (
      !confirm(
        `Delete "${name}"? Any expenses in this category will be moved to Uncategorized.`
      )
    )
      return;
    setMessage("");
    setError("");
    try {
      const { data } = await api.delete(`/admin/categories/${id}`);
      setMessage(
        `Deleted "${name}". Reassigned ${data.reassignedExpenses} expense(s) to ${data.movedTo}.`
      );
      await load();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to delete category";
      setError(msg);
    }
  };

  if (loading || !insights) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-slate-500">
        Loading admin data…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>

      {(message || error) && (
        <div
          className={`text-sm p-3 rounded-lg ${
            error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          {error || message}
        </div>
      )}

      {/* Platform metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat title="Users" value={insights.totalUsers.toString()} />
        <Stat title="Total Expenses" value={insights.totalExpenses.toString()} />
        <Stat title="Total Value" value={`$${insights.totalValue.toFixed(2)}`} />
        <Stat
          title="This Month"
          value={insights.currentMonthCount.toString()}
        />
      </div>

      {/* Category management */}
      <section className="bg-white rounded-xl shadow-sm p-5 space-y-3">
        <h2 className="font-bold text-slate-800">Manage Categories</h2>

        <div className="flex gap-2 flex-wrap">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New category name"
            className="flex-1 min-w-[180px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        <ul className="divide-y divide-slate-100">
          {categories.map((c) => (
            <CategoryRow
              key={c._id}
              category={c}
              onRename={renameCategory}
              onDelete={deleteCategory}
            />
          ))}
        </ul>
      </section>

      {/* Top & Bottom 5 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ListCard title="Top 5 Categories" items={insights.top5} />
        <ListCard title="Bottom 5 Categories" items={insights.bottom5} />
      </section>

      {/* Spending per category */}
      <section className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-bold text-slate-800 mb-3">Spending per Category</h2>
        {insights.spendingPerCategory.length === 0 ? (
          <p className="text-slate-500 text-sm">No data yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {insights.spendingPerCategory.map((c) => (
              <li
                key={c._id}
                className="py-2 flex justify-between items-center"
              >
                <span className="text-slate-700">
                  {c.icon} {c.name}
                </span>
                <span className="text-slate-800 font-semibold">
                  ${c.total.toFixed(2)}{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    ({c.count})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent activity */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-slate-800 mb-3">Recent Expenses</h2>
          <ul className="divide-y divide-slate-100">
            {insights.recentExpenses.map((e) => (
              <li key={e._id} className="py-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-800 truncate">
                    {e.title}
                  </span>
                  <span className="font-semibold text-slate-800 whitespace-nowrap">
                    ${e.amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {e.category?.icon} {e.category?.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-slate-800 mb-3">Recent Users</h2>
          <ul className="divide-y divide-slate-100">
            {insights.recentUsers.map((u) => (
              <li key={u._id} className="py-2 text-sm">
                <div className="font-medium text-slate-800">{u.name}</div>
                <div className="text-xs text-slate-500">
                  {u.email} · {u.role}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}

function CategoryRow({
  category,
  onRename,
  onDelete,
}: {
  category: Category;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string, name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);

  const commit = () => {
    if (name.trim() && name.trim() !== category.name) {
      onRename(category._id, name);
    }
    setEditing(false);
  };

  return (
    <li className="py-2 flex items-center justify-between gap-3">
      {editing ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setName(category.name);
              setEditing(false);
            }
          }}
          autoFocus
          className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <span
          onClick={() => setEditing(true)}
          className="cursor-pointer text-slate-700 hover:text-slate-900 flex-1"
        >
          {category.icon} {category.name}
        </span>
      )}

      <div className="flex items-center gap-2">
        {category.isDefault && (
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            default
          </span>
        )}
        <button
          disabled={category.isDefault}
          onClick={() => onDelete(category._id, category.name)}
          className="text-sm text-red-600 hover:text-red-800 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

function ListCard({
  title,
  items,
}: {
  title: string;
  items: { _id: string; name: string; icon?: string; count: number; total: number }[];
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="font-bold text-slate-800 mb-3">{title}</h2>
      {items.length === 0 ? (
        <p className="text-slate-500 text-sm">No data yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((c) => (
            <li
              key={c._id}
              className="py-2 flex justify-between items-center text-sm"
            >
              <span className="text-slate-700">
                {c.icon} {c.name}
              </span>
              <span className="text-slate-500">
                {c.count} use{c.count === 1 ? "" : "s"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}