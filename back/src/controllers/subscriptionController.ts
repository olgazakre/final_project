import { Request, Response } from "express";
import Subscription from "../models/SubscriptionModel";
import User from "../models/UserModel";
import { RequestWithUser } from "../middlewares/authMiddleware";

export const getFollowers = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const followers = await User.findById(userId).populate("followers", "username avatar");
        res.json(followers?.followers || []);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при получении подписчиков" });
    }
};

export const getFollowing = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const following = await User.findById(userId).populate("following", "username avatar");
        res.json(following?.following || []);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при получении подписок" });
    }
};

export const followUser = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const followerId = req.user?.id;

        if (followerId === userId) {
            res.status(400).json({ message: "Нельзя подписаться на самого себя" });
            return 
        }

        const existingSubscription = await Subscription.findOne({ follower: followerId, following: userId });

        if (existingSubscription) {
            res.status(400).json({ message: "Вы уже подписаны на этого пользователя" });
            return 
        }

        const subscription = new Subscription({ follower: followerId, following: userId });
        await subscription.save();

        await User.findByIdAndUpdate(followerId, { $addToSet: { following: userId } });
        await User.findByIdAndUpdate(userId, { $addToSet: { followers: followerId } });

        res.json({ message: "Подписка успешна", subscription });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при подписке" });
    }
};

export const unfollowUser = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const followerId = req.user?.id;

        const subscription = await Subscription.findOneAndDelete({ follower: followerId, following: userId });

        if (!subscription) {
            res.status(400).json({ message: "Вы не подписаны на этого пользователя" });
            return 
        }

        await User.findByIdAndUpdate(followerId, { $pull: { following: userId } });
        await User.findByIdAndUpdate(userId, { $pull: { followers: followerId } });

        res.json({ message: "Вы успешно отписались" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при отписке" });
    }
};
