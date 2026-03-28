import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import { isDemoMode } from "../config/runtime.js";
import { demoStore } from "../data/demoStore.js";

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function signup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  const existing = isDemoMode()
    ? demoStore.users.findByEmail(email)
    : await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "An account with that email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = isDemoMode()
    ? demoStore.users.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: "student",
      })
    : await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: "student",
      });

  if (isDemoMode()) {
    demoStore.activities.add("signup", user._id);
  } else {
    await ActivityLog.create({
      userId: user._id,
      action: "signup",
    });
  }

  return res.status(201).json({
    token: signToken(user),
    user: sanitizeUser(user),
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = isDemoMode()
    ? demoStore.users.findByEmail(email)
    : await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  if (isDemoMode()) {
    demoStore.activities.add("login", user._id);
  } else {
    await ActivityLog.create({
      userId: user._id,
      action: "login",
    });
  }

  return res.json({
    token: signToken(user),
    user: sanitizeUser(user),
  });
}

export async function me(req, res) {
  return res.json({
    user: sanitizeUser(req.user),
  });
}

export async function updateProfile(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }

  if (isDemoMode()) {
    const updatedUser = demoStore.users.updateName(req.user._id, name);
    req.user = updatedUser;
  } else {
    req.user.name = name;
    await req.user.save();
  }

  return res.json({
    user: sanitizeUser(req.user),
  });
}
