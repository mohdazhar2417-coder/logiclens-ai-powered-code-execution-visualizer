import { Router } from "express";
import { addFavorite, deleteFavorite, listFavorites } from "../controllers/favoriteController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.post("/", addFavorite);
router.get("/", listFavorites);
router.delete("/:id", deleteFavorite);

export default router;
