import mongoose from "mongoose";

const savedTraceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: String,
    subtype: String,
    code: {
      type: String,
      required: true,
    },
    customInputs: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    traceSummary: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    finalOutput: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: "savedAt", updatedAt: true },
  },
);

export default mongoose.model("SavedTrace", savedTraceSchema);
