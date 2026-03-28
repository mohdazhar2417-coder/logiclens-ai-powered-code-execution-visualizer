import { Router } from "express";
import { addFavorite, deleteFavorite, listFavorites } from "../controllers/favoriteController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.use(authMiddleware);
router.post(
  "/",
  validateRequest([{ field: "programId", type: "string", required: true }]),
  addFavorite,
);
router.get("/", listFavorites);
router.delete("/:id", deleteFavorite);

export default router;
