import { useEffect, useState } from "react";
import api from "../services/api";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setFilter, setPage, resetFilters } from "../redux/filtersSlice";
import type { Category, Expense, PaginatedExpenses } from "../types";
import ExpenseForm from "../components/ExpenseForm";

export default function ExpensesPage() {
  const filters = useAppSelector((s) => s.filters);
  const dispatch = useAppDispatch();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Load categories once
  useEffect(() => {
    api.get<Category[]>("/categories").then((r) => setCategories(r.data));
  }, []);

  // Load expenses whenever filters change OR reloadKey is bumped
  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = {
      page: filters.page,
      limit: 8,
      sortBy: filters.sortBy,
      order: filters.order,
    };
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.minAmount) params.minAmount = filters.minAmount;
    if (filters.maxAmount) params.maxAmount = filters.maxAmount;

    api
      .get<PaginatedExpenses>("/expenses", { params })
      .then((r) => {
        setExpenses(r.data.items);
        setPages(r.data.pages);
        setTotal(r.data.total);
      })
      .finally(() => setLoading(false));
  }, [filters, reloadKey]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    await api.delete(`/expenses/${id}`);
    setReloadKey((k) => k + 1);
  };

  const openAdd = () => {
    setEditing(null);
    // Force ExpenseForm to remount with a fresh state
    setShowForm(false);
    setTimeout(() => setShowForm(true), 0);
  };

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Expenses</h1>
          <p className="text-sm text-slate-500">{total} total</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Add Expense
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm grid grid-cols-2 md:grid-cols-4 gap-3">
        <input
          placeholder="Search title…"
          value={filters.search}
          onChange={(e) => dispatch(setFilter({ search: e.target.value }))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filters.category}
          onChange={(e) => dispatch(setFilter({ category: e.target.value }))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
        <select
          value={filters.paymentMethod}
          onChange={(e) => dispatch(setFilter({ paymentMethod: e.target.value }))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All methods</option>
          {["cash", "card", "upi", "bank", "other"].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              dispatch(setFilter({ sortBy: e.target.value as "date" | "amount" }))
            }
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
          <select
            value={filters.order}
            onChange={(e) =>
              dispatch(setFilter({ order: e.target.value as "asc" | "desc" }))
            }
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">↓ Desc</option>
            <option value="asc">↑ Asc</option>
          </select>
        </div>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => dispatch(setFilter({ startDate: e.target.value }))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => dispatch(setFilter({ endDate: e.target.value }))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Min $"
          value={filters.minAmount}
          onChange={(e) => dispatch(setFilter({ minAmount: e.target.value }))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Max $"
          value={filters.maxAmount}
          onChange={(e) => dispatch(setFilter({ maxAmount: e.target.value }))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => dispatch(resetFilters())}
          className="text-sm text-slate-500 hover:text-slate-800 underline"
        >
          Reset filters
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm divide-y divide-slate-100">
        {loading && (
          <p className="p-6 text-center text-slate-500">Loading…</p>
        )}
        {!loading && expenses.length === 0 && (
          <p className="p-6 text-center text-slate-500">
            No expenses match your filters.
          </p>
        )}
        {!loading &&
          expenses.map((e) => (
            <div
              key={e._id}
              className="p-4 flex flex-wrap justify-between items-center gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-800 truncate">
                  {e.title}
                </p>
                <p className="text-sm text-slate-500">
                  {e.category?.icon} {e.category?.name} • {e.paymentMethod} •{" "}
                  {new Date(e.date).toLocaleDateString()}
                </p>
                {e.notes && (
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {e.notes}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">
                  ${e.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => openEdit(e)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(e._id)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              onClick={() => dispatch(setPage(i + 1))}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filters.page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <ExpenseForm
          categories={categories}
          expense={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            setReloadKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}