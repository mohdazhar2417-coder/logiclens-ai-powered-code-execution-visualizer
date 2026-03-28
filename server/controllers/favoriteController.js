import FavoriteProgram from "../models/FavoriteProgram.js";
import Program from "../models/Program.js";
import { isDemoMode } from "../config/runtime.js";
import { demoStore } from "../data/demoStore.js";

export async function addFavorite(req, res) {
  const { programId } = req.body;

  if (!programId) {
    return res.status(400).json({ message: "Program ID is required." });
  }

  const program = isDemoMode()
    ? demoStore.programs.findById(programId)
    : await Program.findById(programId);
  if (!program) {
    return res.status(404).json({ message: "Program not found." });
  }

  const favorite = isDemoMode()
    ? demoStore.favorites.add(req.user._id, program)
    : await FavoriteProgram.findOneAndUpdate(
        { userId: req.user._id, programId },
        {
          userId: req.user._id,
          programId,
          programMeta: {
            name: program.name,
            category: program.category,
            subtype: program.subtype,
            difficulty: program.difficulty,
            tags: program.tags,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

  return res.status(201).json(favorite);
}

export async function listFavorites(req, res) {
  const favorites = isDemoMode()
    ? demoStore.favorites.listByUser(req.user._id)
    : await FavoriteProgram.find({ userId: req.user._id })
        .populate("programId")
        .sort({ addedAt: -1 });
  return res.json(favorites);
}

export async function deleteFavorite(req, res) {
  const favorite = isDemoMode()
    ? demoStore.favorites.deleteByUserAndId(req.user._id, req.params.id)
    : await FavoriteProgram.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!favorite) {
    return res.status(404).json({ message: "Favorite not found." });
  }

  return res.json({ message: "Favorite removed." });
}
