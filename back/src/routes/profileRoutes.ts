import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController";
import { authenticate } from "../middlewares/authMiddleware";
import { upload, processImage } from "../middlewares/uploadMiddleware";

const router = express.Router();

router.get("/:id", getProfile); 
router.put("/", authenticate, upload.single("avatar"), processImage, updateProfile); 

export default router;
