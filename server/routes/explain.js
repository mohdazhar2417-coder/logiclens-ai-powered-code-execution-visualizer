import { Router } from "express";
import { explain } from "../controllers/analysisController.js";

const router = Router();

router.post("/", explain);

export default router;
