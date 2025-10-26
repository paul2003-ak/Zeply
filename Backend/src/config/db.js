import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDb = async () => {
  try {
    console.log("🟢 Connecting to MongoDB...");
    console.log("MONGODB_URI:", ENV.MONGODB_URI ? "Loaded" : "Missing");

    await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // wait up to 30s
      tls: true,
    });

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};
