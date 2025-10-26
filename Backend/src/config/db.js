import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDb = async () => {
  try {
    console.log("🟢 Connecting to MongoDB...");
    console.log("MONGODB_URI:", ENV.MONGODB_URI ? "Loaded" : "Missing");
    console.log("🔍 MONGODB_URI value snippet:", ENV.MONGODB_URI?.slice(0, 50)); // start ka part only

    await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000
    });

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
};
