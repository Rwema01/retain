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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return <div className="p-6 text-[#b8d4b8]">Loading admin data…</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      {(message || error) && (
        <div
          className={`text-sm p-3 rounded-lg ${error
              ? "bg-red-500/10 border border-red-500/30 text-red-400"
              : "bg-accent/10 border border-accent/30 text-accent"
            }`}
        >
          {error || message}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat title="Users" value={insights.totalUsers.toString()} />
        <Stat title="Total Expenses" value={insights.totalExpenses.toString()} />
        <Stat title="Total Value" value={`$${insights.totalValue.toFixed(2)}`} />
        <Stat title="This Month" value={insights.currentMonthCount.toString()} />
      </div>

      <section className="bg-card border border-rim rounded-xl p-5 space-y-3">
        <h2 className="font-bold text-ink">Manage Categories</h2>

        <div className="flex gap-2 flex-wrap">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New category name"
            className="flex-1 min-w-[180px] bg-white text-black placeholder:text-gray-500 border border-rim rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={addCategory}
            className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-500 transition"
          >
            Add
          </button>
        </div>

        <ul className="divide-y divide-rim">
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

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ListCard title="Top 5 Categories" items={insights.top5} />
        <ListCard title="Bottom 5 Categories" items={insights.bottom5} />
      </section>

      <section className="bg-card border border-rim rounded-xl p-5">
        <h2 className="font-bold text-ink mb-3">Spending per Category</h2>
        {insights.spendingPerCategory.length === 0 ? (
          <p className="text-ink-muted text-sm">No data yet.</p>
        ) : (
          <ul className="divide-y divide-rim">
            {insights.spendingPerCategory.map((c) => (
              <li key={c._id} className="py-2 flex justify-between items-center">
                <span className="text-ink">
                  {c.icon} {c.name}
                </span>
                <span className="text-ink font-semibold">
                  ${c.total.toFixed(2)}{" "}
                  <span className="text-xs text-ink-muted/70 font-normal">
                    ({c.count})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-rim rounded-xl p-5">
          <h2 className="font-bold text-ink mb-3">Recent Expenses</h2>
          <ul className="divide-y divide-rim">
            {insights.recentExpenses.map((e) => (
              <li key={e._id} className="py-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-ink truncate">
                    {e.title}
                  </span>
                  <span className="font-semibold text-ink whitespace-nowrap">
                    ${e.amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-ink-muted">
                  {e.category?.icon} {e.category?.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card border border-rim rounded-xl p-5">
          <h2 className="font-bold text-ink mb-3">Recent Users</h2>
          <ul className="divide-y divide-rim">
            {insights.recentUsers.map((u) => (
              <li key={u._id} className="py-2 text-sm">
                <div className="font-medium text-ink">{u.name}</div>
                <div className="text-xs text-ink-muted">
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
    <div className="bg-card border border-rim rounded-xl p-5">
      <p className="text-sm text-ink-muted">{title}</p>
      <p className="text-2xl font-bold text-ink mt-1">{value}</p>
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
          className="flex-1 bg-white text-black border border-rim rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      ) : (
        <span
          onClick={() => setEditing(true)}
          className="cursor-pointer text-ink hover:text-accent flex-1"
        >
          {category.icon} {category.name}
        </span>
      )}

      <div className="flex items-center gap-2">
        {category.isDefault && (
          <span className="text-xs bg-elevated border border-rim text-ink-muted px-2 py-0.5 rounded">
            default
          </span>
        )}
        <button
          disabled={category.isDefault}
          onClick={() => onDelete(category._id, category.name)}
          className="text-sm text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
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
    <div className="bg-card border border-rim rounded-xl p-5">
      <h2 className="font-bold text-ink mb-3">{title}</h2>
      {items.length === 0 ? (
        <p className="text-ink-muted text-sm">No data yet.</p>
      ) : (
        <ul className="divide-y divide-rim">
          {items.map((c) => (
            <li
              key={c._id}
              className="py-2 flex justify-between items-center text-sm"
            >
              <span className="text-ink">
                {c.icon} {c.name}
              </span>
              <span className="text-ink-muted">
                {c.count} use{c.count === 1 ? "" : "s"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}