import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticate, getNotifications);
router.put("/mark-as-read", authenticate, markAsRead);

export default router;

