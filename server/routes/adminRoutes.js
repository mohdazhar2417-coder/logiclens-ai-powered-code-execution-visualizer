import { Router } from "express";
import { createProgram, deleteProgram, getPrograms, updateProgram } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(authMiddleware, roleMiddleware("admin"));
router.get("/programs", getPrograms);
router.post("/programs", createProgram);
router.put("/programs/:id", updateProgram);
router.delete("/programs/:id", deleteProgram);

export default router;
