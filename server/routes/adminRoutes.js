import { Router } from "express";
import { createProgram, deleteProgram, getPrograms, updateProgram } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware, roleMiddleware("admin"));
router.get("/programs", getPrograms);
router.post(
  "/programs",
  validateRequest([
    { field: "name", type: "string", required: true, minLength: 2 },
    { field: "category", type: "string", required: true, minLength: 2 },
    { field: "subtype", type: "string", required: true, minLength: 2 },
    { field: "description", type: "string", required: true, minLength: 4 },
    { field: "code", type: "string", required: true, minLength: 4 },
  ]),
  createProgram,
);
router.put(
  "/programs/:id",
  validateRequest([
    { field: "name", type: "string", required: true, minLength: 2 },
    { field: "category", type: "string", required: true, minLength: 2 },
    { field: "subtype", type: "string", required: true, minLength: 2 },
    { field: "description", type: "string", required: true, minLength: 4 },
    { field: "code", type: "string", required: true, minLength: 4 },
  ]),
  updateProgram,
);
router.delete("/programs/:id", deleteProgram);

export default router;
