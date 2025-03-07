import express from "express";
import {
  getUserPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getAllPosts,
  explorePosts,
} from "../controllers/postController";
import { authenticate } from "../middlewares/authMiddleware";
import { upload, processImage } from "../middlewares/uploadImage";

const router = express.Router();

router.get("/user", authenticate, getUserPosts);
router.post("/", authenticate, upload.single("image"), processImage, createPost);
router.put("/:id", authenticate, upload.single("image"), processImage, updatePost);
router.delete("/:id", authenticate, deletePost);
router.get("/", getAllPosts);
router.get("/explore", explorePosts);
router.get("/:id([0-9a-fA-F]{24})", getPostById);


export default router;
