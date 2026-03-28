import mongoose from "mongoose";

const favoriteProgramSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    programMeta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: "addedAt", updatedAt: true },
  },
);

favoriteProgramSchema.index({ userId: 1, programId: 1 }, { unique: true });

export default mongoose.model("FavoriteProgram", favoriteProgramSchema);
