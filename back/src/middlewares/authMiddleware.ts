import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export interface RequestWithUser extends Request {
  user?: { id: string };
}

export const authenticate = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
     res.status(401).json({ message: "Нет токена, авторизация отклонена" });
     return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = { id: decoded.id }; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Неверный токен" });
  }
};
