import express from "express";
import Category from "../models/Category.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require a valid token + admin role
router.use(protect, adminOnly);

/* ------------------------------------------------------------------ */
/*  CATEGORY MANAGEMENT                                                */
/* ------------------------------------------------------------------ */

/**
 * POST /api/admin/categories
 * Body: { name, icon? }
 */
router.post("/categories", async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name: name.trim(), icon });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * PUT /api/admin/categories/:id
 * Body: { name?, icon? }
 */
router.put("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (req.body.name) category.name = req.body.name.trim();
    if (req.body.icon !== undefined) category.icon = req.body.icon;

    await category.save();
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * DELETE /api/admin/categories/:id
 * - Refuses to delete the default "Uncategorized" category.
 * - Reassigns all expenses in the deleted category to the default.
 */
router.delete("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (category.isDefault) {
      return res
        .status(400)
        .json({ message: "Cannot delete the default category" });
    }

    // Find or create the default fallback category
    let fallback = await Category.findOne({ isDefault: true });
    if (!fallback) {
      fallback = await Category.create({
        name: "Uncategorized",
        icon: "❓",
        isDefault: true,
      });
    }

    // Reassign all expenses from deleted category to fallback
    const { modifiedCount } = await Expense.updateMany(
      { category: category._id },
      { category: fallback._id }
    );

    await category.deleteOne();

    res.json({
      message: "Category deleted",
      reassignedExpenses: modifiedCount,
      movedTo: fallback.name,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ------------------------------------------------------------------ */
/*  PLATFORM INSIGHTS                                                  */
/* ------------------------------------------------------------------ */

/**
 * GET /api/admin/insights
 * Aggregated stats for the admin dashboard.
 */
router.get("/insights", async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalExpenses,
      totalValueAgg,
      currentMonthCount,
      spendingPerCategory,
      recentExpenses,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Expense.countDocuments(),
      Expense.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.countDocuments({ date: { $gte: monthStart } }),
      Expense.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            total: { $sum: "$amount" },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "cat",
          },
        },
        { $unwind: { path: "$cat", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            name: { $ifNull: ["$cat.name", "Uncategorized"] },
            icon: { $ifNull: ["$cat.icon", "❓"] },
            count: 1,
            total: 1,
          },
        },
        { $sort: { count: -1 } },
      ]),
      Expense.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("category", "name icon")
        .populate("user", "name email"),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role createdAt"),
    ]);

    const totalValue = totalValueAgg[0]?.total ?? 0;

    res.json({
      totalUsers,
      totalExpenses,
      totalValue,
      currentMonthCount,
      spendingPerCategory,
      top5: spendingPerCategory.slice(0, 5),
      bottom5: [...spendingPerCategory].reverse().slice(0, 5),
      recentExpenses,
      recentUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;