import { Request, Response } from "express";
import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const registerUser = async (req: Request, res: Response):Promise<void> => {
  try {
    const { username, email, password, fullName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
       res.status(400).json({ message: "Email уже используется" });
    }

    const newUser = new User({ username, email, password, fullName });
    await newUser.save();

    res.status(201).json({ message: "Пользователь зарегистрирован" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        res.status(400).json({ message: "Неверные учетные данные" });
        return;
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Неверные учетные данные" });
        return;
      }
  
      const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: "1d" });
  
      res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера", error });
    }
  };
  
