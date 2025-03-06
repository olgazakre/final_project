import { Request, Response } from "express";
import Like from "../models/likeModel";
import Post from "../models/PostModel";
import User from "../models/UserModel";
import { RequestWithUser } from "../middlewares/authMiddleware";
import { Types } from "mongoose";

export const toggleLike = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Пользователь не авторизирован" });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Пост не найден" });
      return;
    }

    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      const likeId = existingLike._id as Types.ObjectId;
      await existingLike.deleteOne();
      post.likes = post.likes.filter(
        (id) => id.toString() !== likeId.toString()
      );

      await post.save();

      await User.findByIdAndUpdate(userId, { $pull: { likes: likeId } });

      res.json({ message: "Лайк удален" });
      return;
    }

    const like = new Like({ user: userId, post: postId });
    await like.save();

    post.likes.push(like._id as Types.ObjectId);
    await post.save();

    await User.findByIdAndUpdate(userId, {
      $push: { likes: like._id as Types.ObjectId },
    });

    res.json({ message: "Лайк добавлен", like });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при изменении лайка" });
  }
};

export const getPostLikes = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const likes = await Like.find({ post: postId }).populate(
      "user",
      "username avatar"
    );

    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении лайков" });
  }
};
