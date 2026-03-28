import Program from "../models/Program.js";
import SavedTrace from "../models/SavedTrace.js";
import User from "../models/User.js";
import { isDemoMode } from "../config/runtime.js";
import { demoStore } from "../data/demoStore.js";

export async function getPrograms(req, res) {
  const programs = isDemoMode()
    ? demoStore.programs.list().sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    : await Program.find().sort({ category: 1, name: 1 });
  const [users, traces, featuredCount] = isDemoMode()
    ? [demoStore.users.count(), demoStore.traces.count(), demoStore.programs.countFeatured()]
    : await Promise.all([
        User.countDocuments(),
        SavedTrace.countDocuments(),
        Program.countDocuments({ featured: true }),
      ]);

  return res.json({
    programs,
    overview: {
      totalUsers: users,
      totalTraces: traces,
      featuredPrograms: featuredCount,
    },
  });
}

export async function createProgram(req, res) {
  const program = isDemoMode()
    ? demoStore.programs.create(req.body)
    : await Program.create(req.body);
  return res.status(201).json(program);
}

export async function updateProgram(req, res) {
  const program = isDemoMode()
    ? demoStore.programs.update(req.params.id, req.body)
    : await Program.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

  if (!program) {
    return res.status(404).json({ message: "Program not found." });
  }

  return res.json(program);
}

export async function deleteProgram(req, res) {
  const program = isDemoMode()
    ? demoStore.programs.delete(req.params.id)
    : await Program.findByIdAndDelete(req.params.id);

  if (!program) {
    return res.status(404).json({ message: "Program not found." });
  }

  return res.json({ message: "Program deleted." });
}
