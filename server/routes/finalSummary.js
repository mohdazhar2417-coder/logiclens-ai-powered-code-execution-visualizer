import { Router } from "express";
import { finalSummary } from "../controllers/analysisController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.post("/", validateRequest([{ field: "code", type: "string", required: true, minLength: 4 }]), finalSummary);

export default router;
