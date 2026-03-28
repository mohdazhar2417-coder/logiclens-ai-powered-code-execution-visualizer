import { Router } from "express";
import { login, me, signup, updateProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.post(
  "/signup",
  validateRequest([
    { field: "name", type: "string", required: true, minLength: 2 },
    { field: "email", type: "string", required: true, minLength: 5 },
    { field: "password", type: "string", required: true, minLength: 6 },
  ]),
  signup,
);
router.post(
  "/login",
  validateRequest([
    { field: "email", type: "string", required: true, minLength: 5 },
    { field: "password", type: "string", required: true, minLength: 6 },
  ]),
  login,
);
router.get("/me", authMiddleware, me);
router.put(
  "/profile",
  authMiddleware,
  validateRequest([{ field: "name", type: "string", required: true, minLength: 2 }]),
  updateProfile,
);

export default router;
