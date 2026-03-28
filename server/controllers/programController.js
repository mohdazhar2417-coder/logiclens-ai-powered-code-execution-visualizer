import Program from "../models/Program.js";
import { isDemoMode } from "../config/runtime.js";
import { demoStore } from "../data/demoStore.js";

export async function listPrograms(_req, res) {
  const programs = isDemoMode()
    ? demoStore.programs.list().sort((a, b) => Number(b.featured) - Number(a.featured) || a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    : await Program.find().sort({ featured: -1, category: 1, name: 1 });
  return res.json(programs);
}
