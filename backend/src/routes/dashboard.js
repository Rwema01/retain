import express from "express";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

/**
 * GET /api/dashboard?month=YYYY-MM
 * Returns summary data for the logged-in user's dashboard.
 */
router.get("/", async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Month must be YYYY-MM" });
    }

    const [year, m] = month.split("-").map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 1);

    const [expenses, budget, recentExpenses] = await Promise.all([
      Expense.find({
        user: req.user._id,
        date: { $gte: start, $lt: end },
      }).populate("category", "name icon"),
      Budget.findOne({ user: req.user._id, month }),
      Expense.find({ user: req.user._id })
        .sort({ date: -1 })
        .limit(5)
        .populate("category", "name icon"),
    ]);

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const budgetAmount = budget?.amount ?? 0;
    const remaining = budgetAmount - totalSpent;

    const highestExpense = expenses.reduce(
      (max, e) => (e.amount > (max?.amount ?? 0) ? e : max),
      null
    );

    // Group spending by category name
    const byCategory = {};
    for (const e of expenses) {
      const name = e.category?.name ?? "Uncategorized";
      byCategory[name] = (byCategory[name] || 0) + e.amount;
    }

    res.json({
      month,
      totalSpent,
      budget: budgetAmount,
      remaining,
      highestExpense,
      byCategory,
      recentExpenses,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;