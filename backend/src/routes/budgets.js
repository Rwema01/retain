import express from "express";
import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

/**
 * Helper: get the first day of month and first day of NEXT month.
 * month format: "YYYY-MM"
 */
const monthRange = (month) => {
  const [year, m] = month.split("-").map(Number);
  const start = new Date(year, m - 1, 1);
  const end = new Date(year, m, 1); // first day of next month
  return { start, end };
};

/**
 * GET /api/budgets/:month
 * Returns { month, amount, totalSpent, remaining, status }
 */
router.get("/:month", async (req, res) => {
  try {
    const { month } = req.params;

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Month must be YYYY-MM" });
    }

    const { start, end } = monthRange(month);

    const [budget, expenses] = await Promise.all([
      Budget.findOne({ user: req.user._id, month }),
      Expense.find({
        user: req.user._id,
        date: { $gte: start, $lt: end },
      }).select("amount"),
    ]);

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const amount = budget?.amount ?? 0;
    const remaining = amount - totalSpent;

    let status = "within";
    if (amount === 0) {
      status = "within";
    } else {
      const pct = (totalSpent / amount) * 100;
      if (pct >= 100) status = "over";
      else if (pct >= 80) status = "approaching";
    }

    res.json({
      month,
      amount,
      totalSpent,
      remaining,
      status,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /api/budgets/:month
 * Body: { amount }
 * Upserts (creates or updates) the budget for that month.
 */
router.put("/:month", async (req, res) => {
  try {
    const { month } = req.params;
    const { amount } = req.body;

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Month must be YYYY-MM" });
    }

    if (amount == null || amount < 0) {
      return res.status(400).json({ message: "amount must be a non-negative number" });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, month },
      { amount },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;