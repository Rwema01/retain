import express from "express";
import Category from "../models/Category.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/categories
 * Returns all categories so the frontend can populate dropdowns.
 * Any authenticated user can call this.
 */
router.get("/", protect, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;