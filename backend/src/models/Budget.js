import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: { type: String, required: true }, // format: "2026-10"
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// One budget per user per month
budgetSchema.index({ user: 1, month: 1 }, { unique: true });

export default mongoose.model("Budget", budgetSchema);