import { Router } from "express";
import { createTrace, deleteTrace, getTrace, listTraces } from "../controllers/traceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.post("/", createTrace);
router.get("/", listTraces);
router.get("/:id", getTrace);
router.delete("/:id", deleteTrace);

export default router;
