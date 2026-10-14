import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Category from "../models/Category.js";

dotenv.config();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@retain.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin1234";
const ADMIN_NAME = "Retain Admin";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // 1. Ensure default "Uncategorized" category exists
    let fallback = await Category.findOne({ isDefault: true });
    if (!fallback) {
      fallback = await Category.create({
        name: "Uncategorized",
        icon: "❓",
        isDefault: true,
      });
      console.log(`✅ Default category created: ${fallback.name} (${fallback._id})`);
    } else {
      console.log(`ℹ️  Default category already exists: ${fallback.name}`);
    }

    // 2. Ensure admin user exists
    let admin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (!admin) {
      admin = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      });
      console.log(`✅ Admin user created: ${admin.email}`);
      console.log(`   Password: ${ADMIN_PASSWORD}  (change this in production)`);
    } else if (admin.role !== "admin") {
      admin.role = "admin";
      await admin.save();
      console.log(`ℹ️  Promoted existing user to admin: ${admin.email}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${admin.email}`);
    }

    // 3. Optional starter categories
    const starter = [
      { name: "Food", icon: "🍕" },
      { name: "Transport", icon: "🚗" },
      { name: "Rent", icon: "🏠" },
      { name: "Utilities", icon: "💡" },
      { name: "Entertainment", icon: "🎬" },
    ];

    for (const cat of starter) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create({ ...cat, isDefault: false });
        console.log(`✅ Category created: ${cat.name}`);
      }
    }

    console.log("\n🎉 Seed complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

run();