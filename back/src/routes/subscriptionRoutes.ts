import express from "express";
import { getFollowers, getFollowing, followUser, unfollowUser } from "../controllers/subscriptionController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);
router.post("/:userId/follow", authenticate, followUser);
router.delete("/:userId/unfollow", authenticate, unfollowUser);

export default router;
