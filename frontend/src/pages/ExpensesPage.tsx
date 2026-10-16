import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setFilter, setPage, resetFilters } from "../redux/filtersSlice";
import { useDebounce } from "../hooks/useDebounce";
import type { Category, Expense, PaginatedExpenses } from "../types";
import ExpenseForm from "../components/ExpenseForm";

export default function ExpensesPage() {
  const filters = useAppSelector((s) => s.filters);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [localStartDate, setLocalStartDate] = useState(filters.startDate);
  const [localEndDate, setLocalEndDate] = useState(filters.endDate);
  const [localMinAmount, setLocalMinAmount] = useState(filters.minAmount);
  const [localMaxAmount, setLocalMaxAmount] = useState(filters.maxAmount);

  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    api.get<Category[]>("/categories").then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      dispatch(setFilter({ search: q }));
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = {
      page: filters.page,
      limit: 8,
      sortBy: filters.sortBy,
      order: filters.order,
    };
    if (debouncedSearch) params.search = debouncedSearch;
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
  }, [filters, debouncedSearch, reloadKey]);

  const applyAdvanced = () => {
    dispatch(
      setFilter({
        startDate: localStartDate,
        endDate: localEndDate,
        minAmount: localMinAmount,
        maxAmount: localMaxAmount,
      })
    );
  };

  const handleReset = () => {
    setLocalStartDate("");
    setLocalEndDate("");
    setLocalMinAmount("");
    setLocalMaxAmount("");
    dispatch(resetFilters());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    await api.delete(`/expenses/${id}`);
    setReloadKey((k) => k + 1);
  };

  const openAdd = () => {
    setEditing(null);
    setShowForm(false);
    setTimeout(() => setShowForm(true), 0);
  };

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    setShowForm(true);
  };

  const inputClass =
    "bg-white text-black placeholder:text-gray-500 border border-rim rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-sm text-[#b8d4b8]">{total} total</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-950 transition"
        >
          + Add Expense
        </button>
      </div>

      {/* Quick live filters */}
      <div className="bg-card border border-rim p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3">
        <input
          placeholder="Search title…"
          value={filters.search}
          onChange={(e) => dispatch(setFilter({ search: e.target.value }))}
          className={inputClass}
        />
        <select
          value={filters.category}
          onChange={(e) => dispatch(setFilter({ category: e.target.value }))}
          className={inputClass}
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
          className={inputClass}
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
            className={`${inputClass} flex-1`}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
          <select
            value={filters.order}
            onChange={(e) =>
              dispatch(setFilter({ order: e.target.value as "asc" | "desc" }))
            }
            className={`${inputClass} flex-1`}
          >
            <option value="desc">↓ Desc</option>
            <option value="asc">↑ Asc</option>
          </select>
        </div>
      </div>

      {/* Advanced filters with Apply */}
      <div className="bg-card border border-rim p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">
            Start date
          </label>
          <input
            type="date"
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
            className={`${inputClass} w-full`}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">
            End date
          </label>
          <input
            type="date"
            value={localEndDate}
            onChange={(e) => setLocalEndDate(e.target.value)}
            className={`${inputClass} w-full`}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">
            Min $
          </label>
          <input
            type="number"
            placeholder="0"
            value={localMinAmount}
            onChange={(e) => setLocalMinAmount(e.target.value)}
            className={`${inputClass} w-full`}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-ink-muted mb-1">
              Max $
            </label>
            <input
              type="number"
              placeholder="∞"
              value={localMaxAmount}
              onChange={(e) => setLocalMaxAmount(e.target.value)}
              className={`${inputClass} w-full`}
            />
          </div>
          <button
            onClick={applyAdvanced}
            className="bg-blue-950 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-500 transition self-end"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="text-sm text-[#b8d4b8] hover:text-white underline"
        >
          Reset filters
        </button>
      </div>

      {/* List */}
      <div className="bg-card border border-rim rounded-xl divide-y divide-rim">
        {loading && (
          <p className="p-6 text-center text-ink-muted">Loading…</p>
        )}
        {!loading && expenses.length === 0 && (
          <p className="p-6 text-center text-ink-muted">
            No expenses match your filters.
          </p>
        )}
        {!loading &&
          expenses.map((e) => (
            <div
              key={e._id}
              className="p-4 flex flex-wrap items-center gap-3 md:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink truncate">{e.title}</p>
                <p className="text-sm text-ink-muted">
                  {e.category?.icon} {e.category?.name} • {e.paymentMethod} •{" "}
                  {new Date(e.date).toLocaleDateString()}
                </p>
                {e.notes && (
                  <p className="text-xs text-ink-muted/70 mt-1 truncate">
                    {e.notes}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-ink">
                  ${e.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => openEdit(e)}
                  className="text-sm text-accent hover:text-accent-hover font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(e._id)}
                  className="text-sm text-red-400 hover:text-red-300 font-medium"
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
              className={`px-3 py-1.5 rounded-lg text-sm transition ${filters.page === i + 1
                ? "bg-accent text-base"
                : "bg-card border border-rim text-ink-muted hover:bg-elevated hover:text-ink"
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