import { Request, Response } from "express";
import Like from "../models/likeModel";
import Post from "../models/PostModel";
import User from "../models/UserModel";
import Comment from "../models/commentModel";
import { RequestWithUser } from "../middlewares/authMiddleware";
import { Types } from "mongoose";
import { createNotification } from "./notificationController";

export const toggleLike = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Пользователь не авторизирован" });
      return;
    }

    if (!Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Некорректный ID поста" });
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    const postObjectId = new Types.ObjectId(postId);

    const post = await Post.findById(postObjectId).populate("author");
    if (!post) {
      res.status(404).json({ message: "Пост не найден" });
      return;
    }

    const existingLike = await Like.findOne({ user: userObjectId, post: postObjectId });

    if (existingLike) {
      const likeId = existingLike._id as Types.ObjectId;
      await existingLike.deleteOne();
      post.likes = post.likes.filter((id) => id.toString() !== likeId.toString());
      await post.save();
      await User.findByIdAndUpdate(userObjectId, { $pull: { likes: likeId } });

      res.json({ message: "Лайк удален" });
      return;
    }

    const like = new Like({ user: userObjectId, post: postObjectId });

    await like.save();

    post.likes.push(like._id as Types.ObjectId);
    await post.save();
    await User.findByIdAndUpdate(userObjectId, { $push: { likes: like._id as Types.ObjectId } });

    if (post.author._id.toString() !== userObjectId.toString()) {
      await createNotification(post.author._id, userObjectId, "liked your post", postObjectId);
    }

    res.json({ message: "Лайк добавлен", like });
  } catch (error) {
    console.error("Ошибка при изменении лайка:", error);
    res.status(500).json({ message: "Ошибка при изменении лайка" });
  }
};

export const getPostLikes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const likes = await Like.find({ post: postId }).populate("user", "username avatar");
    res.json(likes);
  } catch (error) {
    console.error("Ошибка при получении лайков:", error);
    res.status(500).json({ message: "Ошибка при получении лайков" });
  }
};

export const toggleLikeComment = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Пользователь не авторизирован" });
      return;
    }

    if (!Types.ObjectId.isValid(commentId)) {
      res.status(400).json({ message: "Некорректный ID комментария" });
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    const commentObjectId = new Types.ObjectId(commentId);

    const comment = await Comment.findById(commentObjectId).populate("author");

    if (!comment) {
      res.status(404).json({ message: "Комментарий не найден" });
      return;
    }

    const existingLike = await Like.findOne({ user: userObjectId, comment: commentObjectId });

    if (existingLike) {
      const likeId = existingLike._id as Types.ObjectId;
      await existingLike.deleteOne();
      comment.likes = comment.likes.filter((id) => id.toString() !== likeId.toString());
      await comment.save();
      await User.findByIdAndUpdate(userObjectId, { $pull: { likes: likeId } });

      res.json({ message: "Лайк комментария удален" });
      return;
    }

    const like = new Like({ user: userObjectId, comment: commentObjectId });
    await like.save();

    comment.likes.push(like._id as Types.ObjectId);
    await comment.save();
    await User.findByIdAndUpdate(userObjectId, { $push: { likes: like._id as Types.ObjectId } });

    if (comment.author._id.toString() !== userObjectId.toString()) {
      await createNotification(comment.author._id, userObjectId, "liked your comment", undefined, commentObjectId);
    }

    res.json({ message: "Лайк комментария добавлен", like });
  } catch (error) {
    console.error("Ошибка при изменении лайка комментария:", error);
    res.status(500).json({ message: "Ошибка при изменении лайка комментария" });
  }
};


export const getCommentLikes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Комментарий не найден" });
      return;
    }

    const likes = await Like.find({ comment: commentId }).populate("user", "username avatar");

    res.json(likes);
  } catch (error) {
    console.error("Ошибка при получении лайков комментария:", error);
    res.status(500).json({ message: "Ошибка при получении лайков комментария" });
  }
};
