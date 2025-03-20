import { Request, Response } from "express";
import Notification from "../models/NotificationModel";
import User from "../models/UserModel";
import { RequestWithUser } from "../middlewares/authMiddleware";
import { Types } from "mongoose";

export const createNotification = async (
    userId: Types.ObjectId,
    senderId: Types.ObjectId,
    type: string,
    postId?: Types.ObjectId,
    commentId?: Types.ObjectId
  ) => {
    try {
      if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(senderId)) {
        console.error("Некорректные ObjectId для пользователя или отправителя");
        return;
      }
  
      if (postId && !Types.ObjectId.isValid(postId)) {
        console.error("Некорректный ObjectId для поста");
        return;
      }
      if (commentId && !Types.ObjectId.isValid(commentId)) {
        console.error("Некорректный ObjectId для комментария");
        return;
      }
  
      const notification = new Notification({
        user: new Types.ObjectId(userId),
        sender: new Types.ObjectId(senderId),
        type,
        post: postId ? new Types.ObjectId(postId) : undefined,
        comment: commentId ? new Types.ObjectId(commentId) : undefined,
        isRead: false,
      });
  
      await notification.save();

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { notifications: notification._id } },
        { new: true }
      );
  
      if (!updatedUser) {
        console.error("Ошибка: Пользователь не найден для обновления уведомлений");
        return;
      }
  
    } catch (error) {
      console.error("Ошибка при создании уведомления:", error);
    }
  };

export const getNotifications = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
    
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Неавторизованный запрос" });
            return 
        }

        const notifications = await Notification.find({ user: req.user.id })
            .populate("sender", "username avatar")
            .populate("post", "image") 
            .populate("comment", "content")
            .sort({ createdAt: -1 });

        if (notifications.length === 0) {
            res.status(404).json({ message: "Уведомления не найдены" });
            return 
        }

        res.json(notifications);
    } catch (error) {
        console.error("Ошибка при получении уведомлений:", error);
        res.status(500).json({ message: "Ошибка при получении уведомлений" });
    }
};


export const markAsRead = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Неавторизованный доступ" });
            return 
        }
        const unreadNotifications = await Notification.countDocuments({ user: req.user.id, isRead: false });
        if (unreadNotifications === 0) {
            res.status(200).json({ message: "У вас нет непрочитанных уведомлений" });
            return 
        }

        await Notification.updateMany({ user: req.user.id, isRead: false }, { $set: { isRead: true } });

        res.json({ message: "Все уведомления отмечены как прочитанные" });
    } catch (error) {
        console.error("Ошибка при обновлении уведомлений:", error);
        res.status(500).json({ message: "Ошибка при обновлении уведомлений", error });
    }
};

