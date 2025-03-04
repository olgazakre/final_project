import { Request, Response } from "express";
import User from "../models/UserModel";
import { RequestWithUser } from "../middlewares/authMiddleware";


export const getProfile = async (req: Request , res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password"); 

    if (!user) {
     res.status(404).json({ message: "Пользователь не найден" });
     return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

export const updateProfile = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { fullName, bio, avatar } = req.body;
    const userId = req.user?.id; 

    if(!userId){
        res.status(401).json({message: "Требуется авторизация"});
        return;
    }

    if(avatar && !avatar.startsWith("data:image/")){
        res.status(400).json({message: "Не верный формат изображения"});
        return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, bio, avatar },
      { new: true, select: "-password" } 
    );

    if (!updatedUser) {
     res.status(404).json({ message: "Пользователь не найден" });
     return;
    }

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error("Ошибка обновления профиля:", error.message)
    res.status(500).json({ message: "Ошибка обновления профиля", error: error.massage || error });
  }
};
