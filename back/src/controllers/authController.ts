import { Request, Response } from "express";
import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { sendResetPasswordEmail } from "../utils/mailer";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || "reset_secret";

export const registerUser = async (req: Request, res: Response):Promise<void> => {
  try {
    const { username, email, password, fullName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
       res.status(400).json({ message: "Email уже используется" });
       return;
    }

    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
       res.status(400).json({ message: "Username уже используется" });
       return;
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
  
      res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar } });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера", error });
    }
  };

  export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        res.status(400).json({ message: "Пользователь не найден" });
        return;
      }
  
      const token = jwt.sign({ id: user._id }, JWT_RESET_SECRET, { expiresIn: "1h" });
  
      await sendResetPasswordEmail(email, token);
      console.log("token: ", token)
      res.json({ message: "Ссылка для сброса пароля отправлена на email", token });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера", error });
    }
  };
  
  
  export const resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
  
      const decoded = jwt.verify(token, JWT_RESET_SECRET) as { id: string };
  
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(400).json({ message: "Некорректный или истекший токен" });
        return;
      }
  
      user.password = newPassword
      await user.save();
  
      res.json({ message: "Пароль успешно обновлен" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера", error });
    }
  };


  
