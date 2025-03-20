import { Request, Response } from "express";
import Comment from "../models/commentModel";
import Post from "../models/PostModel";
import User from "../models/UserModel";
import { RequestWithUser } from "../middlewares/authMiddleware";
import { createNotification } from "./notificationController";
import { Types } from "mongoose";

export const addComment = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!text) {
      res.status(400).json({ message: "Комментарий не может быть пустым" });
      return;
    }

    if (!Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Некорректный ID поста" });
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    const postObjectId = new Types.ObjectId(postId);

    const post = await Post.findById(postObjectId).populate("author", "_id username avatar");
    if (!post) {
      res.status(404).json({ message: "Пост не найден" });
      return;
    }

    const comment = new Comment({
      user: userObjectId,      
      post: postObjectId,
      text,
      author: post.author._id, 
    });
    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    await User.findByIdAndUpdate(userObjectId, { $push: { comments: comment._id } });

    if (post.author._id.toString() !== userObjectId.toString()) {
      await createNotification(post.author._id, userObjectId, "commented on your post", postObjectId, comment._id);
    }

    await comment.populate("user", "username avatar");

    res.json({ message: "Комментарий добавлен", comment });
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error);
    res.status(500).json({ message: "Ошибка при добавлении комментария" });
  }
};


export const deleteComment = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Комментарий не найден" });
      return;
    }

    if (comment.user.toString() !== userId && comment.author.toString() !== userId) {
      res.status(403).json({ message: "Нет прав для удаления" });
      return;
    }

    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });

    await User.findByIdAndUpdate(userId, { $pull: { comments: comment._id } });

    await comment.deleteOne();
    res.json({ message: "Комментарий удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении комментария" });
  }
};

export const getPostComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate("user", "username avatar") 
      .populate("author", "username avatar"); 

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении комментариев" });
  }
};

