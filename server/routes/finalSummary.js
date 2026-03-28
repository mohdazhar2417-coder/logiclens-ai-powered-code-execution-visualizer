import { Router } from "express";
import { finalSummary } from "../controllers/analysisController.js";

const router = Router();

router.post("/", finalSummary);

export default router;
