import express from "express";
import Expense from "../models/Expense.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Every route below requires a valid token
router.use(protect);

/**
 * GET /api/expenses
 * Query params (all optional):
 *   search        - matches title
 *   category      - category ObjectId
 *   paymentMethod - cash | card | upi | bank | other
 *   startDate     - ISO date (>=)
 *   endDate       - ISO date (<=)
 *   minAmount     - number
 *   maxAmount     - number
 *   sortBy        - date | amount (default: date)
 *   order         - asc | desc (default: desc)
 *   page          - 1-based (default: 1)
 *   limit         - items per page (default: 10, max: 100)
 */
router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      paymentMethod,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = "date",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const query = { user: req.user._id };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    const sortField = sortBy === "amount" ? "amount" : "date";
    const sortOrder = order === "asc" ? 1 : -1;
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Expense.find(query)
        .populate("category", "name icon")
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Expense.countDocuments(query),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/expenses/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("category", "name icon");

    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/expenses
 * Body: { title, amount, category, paymentMethod, date, notes? }
 */
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, date, notes } = req.body;

    if (!title || amount == null || !category || !paymentMethod || !date) {
      return res.status(400).json({
        message: "title, amount, category, paymentMethod and date are required",
      });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      paymentMethod,
      date,
      notes,
    });

    const populated = await expense.populate("category", "name icon");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * PUT /api/expenses/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate("category", "name icon");

    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * DELETE /api/expenses/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted", _id: deleted._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;