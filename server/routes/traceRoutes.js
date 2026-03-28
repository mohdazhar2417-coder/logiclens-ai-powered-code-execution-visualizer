import { Router } from "express";
import { createTrace, deleteTrace, getTrace, listTraces } from "../controllers/traceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);
router.post(
  "/",
  validateRequest([
    { field: "title", type: "string", required: true, minLength: 2 },
    { field: "code", type: "string", required: true, minLength: 4 },
  ]),
  createTrace,
);
router.get("/", listTraces);
router.get("/:id", getTrace);
router.delete("/:id", deleteTrace);

export default router;
