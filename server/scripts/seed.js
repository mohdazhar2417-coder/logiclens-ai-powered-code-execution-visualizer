import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Program from "../models/Program.js";
import User from "../models/User.js";
import { samplePrograms } from "../data/samplePrograms.js";

dotenv.config({ path: "../.env" });

async function seed() {
  await connectDB();

  await Program.deleteMany({});
  await Program.insertMany(samplePrograms);

  const email = (process.env.ADMIN_EMAIL || "admin@logiclens.dev").toLowerCase();
  const existingAdmin = await User.findOne({ email });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin123!", 10);
    await User.create({
      name: process.env.ADMIN_NAME || "LogicLens Admin",
      email,
      passwordHash,
      role: "admin",
    });
  }

  console.log(`Seeded ${samplePrograms.length} sample programs.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
