import express from "express";
import { toggleLike, getPostLikes, getCommentLikes, toggleLikeComment } from "../controllers/likeController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/posts/:postId/like", authenticate, toggleLike);
router.get("/posts/:postId/likes", getPostLikes);
router.post("/comments/:commentId/like", authenticate, toggleLikeComment);
router.get("/comments/:commentId/likes", getCommentLikes);

export default router;
