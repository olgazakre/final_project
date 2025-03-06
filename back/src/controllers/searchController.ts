import { Request, Response } from "express";
import User from "../models/UserModel";

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    if (!query) {
      res.status(400).json({ message: "Запрос не может быть пустым" });
      return
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    }).select("username fullName avatar"); 

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при поиске пользователей" });
  }
};
