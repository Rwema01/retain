// ---------------------------------------------------------------------------
// Domain types — mirror the backend models and API responses
// ---------------------------------------------------------------------------

export type UserRole = "user" | "admin";

export type PaymentMethod = "cash" | "card" | "upi" | "bank" | "other";

export type BudgetStatus = "within" | "approaching" | "over";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  _id: string;
  name: string;
  icon?: string;
  isDefault?: boolean;
}

export interface Expense {
  _id: string;
  user: string;
  title: string;
  amount: number;
  category: Category;
  paymentMethod: PaymentMethod;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensePayload {
  title: string;
  amount: number;
  category: string;
  paymentMethod: PaymentMethod;
  date: string;
  notes?: string;
}

export interface PaginatedExpenses {
  items: Expense[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface FiltersState {
  search: string;
  category: string;
  paymentMethod: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  sortBy: "date" | "amount";
  order: "asc" | "desc";
  page: number;
}

export interface BudgetInfo {
  month: string;
  amount: number;
  totalSpent: number;
  remaining: number;
  status: BudgetStatus;
}

export interface DashboardData {
  month: string;
  totalSpent: number;
  budget: number;
  remaining: number;
  highestExpense: Expense | null;
  byCategory: Record<string, number>;
  recentExpenses: Expense[];
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export interface CategoryCount {
  _id: string;
  name: string;
  icon?: string;
  count: number;
  total: number;
}

export interface AdminInsights {
  totalUsers: number;
  totalExpenses: number;
  totalValue: number;
  currentMonthCount: number;
  spendingPerCategory: CategoryCount[];
  top5: CategoryCount[];
  bottom5: CategoryCount[];
  recentExpenses: Expense[];
  recentUsers: User[];
}