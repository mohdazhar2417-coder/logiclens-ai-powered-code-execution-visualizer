import mongoose from "mongoose";

export function isDemoMode() {
  const uri = (process.env.MONGO_URI || "").trim();
  return !uri || uri.startsWith("replace-") || mongoose.connection.readyState !== 1;
}
