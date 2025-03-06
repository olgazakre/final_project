import express from "express";
import { toggleLike, getPostLikes } from "../controllers/likeController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/:postId/like", authenticate, toggleLike);
router.get("/:postId/likes", getPostLikes);

export default router;
