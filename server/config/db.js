import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("⚠️ MONGO_URI not found. Running without DB (demo mode).");
    return;
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.warn("⚠️ MongoDB connection failed. Running without DB.");
  }
}