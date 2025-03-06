import express from "express";
import { addComment, deleteComment, getPostComments } from "../controllers/commentController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/:postId/comment", authenticate, addComment);
router.delete("/comment/:commentId", authenticate, deleteComment);
router.get("/:postId/comments", getPostComments);

export default router;
