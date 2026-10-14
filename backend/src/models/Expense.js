import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "bank", "other"],
      required: true,
    },
    date: { type: Date, required: true, index: true },
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, date: -1 });

export default mongoose.model("Expense", expenseSchema);