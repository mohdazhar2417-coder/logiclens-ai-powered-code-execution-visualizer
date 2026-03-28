import SavedTrace from "../models/SavedTrace.js";
import ActivityLog from "../models/ActivityLog.js";
import { isDemoMode } from "../config/runtime.js";
import { demoStore } from "../data/demoStore.js";

export async function createTrace(req, res) {
  const { title, category, subtype, code, customInputs, traceSummary, finalOutput, supportLevel, confidence } = req.body;

  if (!title || !code) {
    return res.status(400).json({ message: "Trace title and code are required." });
  }

  const trace = isDemoMode()
    ? demoStore.traces.create({
        userId: req.user._id,
        title,
        category,
        subtype,
        code,
        customInputs: customInputs || {},
        traceSummary: traceSummary || {},
        supportLevel: supportLevel || "full",
        confidence: confidence || 0,
        finalOutput: finalOutput || "",
      })
    : await SavedTrace.create({
        userId: req.user._id,
        title,
        category,
        subtype,
        code,
        customInputs: customInputs || {},
        traceSummary: traceSummary || {},
        supportLevel: supportLevel || "full",
        confidence: confidence || 0,
        finalOutput: finalOutput || "",
      });

  if (isDemoMode()) {
    demoStore.activities.add("trace_saved", req.user._id, { traceId: trace._id, title: trace.title });
  } else {
    await ActivityLog.create({
      userId: req.user._id,
      action: "trace_saved",
      meta: { traceId: trace._id, title: trace.title },
    });
  }

  return res.status(201).json(trace);
}

export async function listTraces(req, res) {
  const traces = isDemoMode()
    ? demoStore.traces.listByUser(req.user._id)
    : await SavedTrace.find({ userId: req.user._id }).sort({ savedAt: -1 }).limit(50);
  return res.json(traces);
}

export async function getTrace(req, res) {
  const trace = isDemoMode()
    ? demoStore.traces.findByUserAndId(req.user._id, req.params.id)
    : await SavedTrace.findOne({ _id: req.params.id, userId: req.user._id });

  if (!trace) {
    return res.status(404).json({ message: "Saved trace not found." });
  }

  return res.json(trace);
}

export async function deleteTrace(req, res) {
  const trace = isDemoMode()
    ? demoStore.traces.deleteByUserAndId(req.user._id, req.params.id)
    : await SavedTrace.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!trace) {
    return res.status(404).json({ message: "Saved trace not found." });
  }

  return res.json({ message: "Trace deleted." });
}
