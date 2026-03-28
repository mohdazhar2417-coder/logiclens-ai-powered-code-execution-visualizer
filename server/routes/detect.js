import { Router } from "express";
import { detect } from "../controllers/analysisController.js";

const router = Router();

router.post("/", detect);

export default router;
