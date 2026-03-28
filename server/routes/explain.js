import { Router } from "express";
import { explain } from "../controllers/analysisController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.post("/", validateRequest([{ field: "code", type: "string", required: true, minLength: 4 }]), explain);

export default router;
