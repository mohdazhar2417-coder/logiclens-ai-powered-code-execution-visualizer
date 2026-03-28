import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isDemoMode } from "../config/runtime.js";
import { demoStore } from "../data/demoStore.js";

export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = isDemoMode()
      ? demoStore.users.findById(payload.id)
      : await User.findById(payload.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
