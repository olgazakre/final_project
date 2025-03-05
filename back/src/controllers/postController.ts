import { Request, Response } from "express";
import Post, { IPost } from "../models/PostModel";
import { RequestWithUser } from "../middlewares/authMiddleware";
import User from "../models/UserModel"
import { Types } from "mongoose";


export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении постов" });
  }
};

export const getUserPosts = async (req: RequestWithUser, res: Response): Promise<void> => {
    if (!req.user?.id) {
      res.status(401).json({ message: "Неавторизованный пользователь" });
      return;
    }
  
    try {
      const user = await User.findById(req.user.id).populate("posts");
      if (!user) {
        res.status(404).json({ message: "Пользователь не найден" });
        return;
      }
  
      if (!user.posts) {
        res.status(404).json({ message: "Посты не найдены" });
        return;
      }
  
      res.json(user.posts); 
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении постов" });
    }
  };
  


  export const createPost = async (req: RequestWithUser, res: Response): Promise<void> => {
    if (!req.user?.id) {
      res.status(401).json({ message: "Неавторизованный пользователь" });
      return;
    }
  
    const { description, image } = req.body;
  
    if (!image) {
      res.status(400).json({ message: "Изображение обязательно" });
      return;
    }
  
    try {
      const newPost: IPost = new Post({
        description,
        image,
        author: req.user.id, 
      });
  
      await newPost.save(); 
  
      const user = await User.findById(req.user.id);
      if (!user) {
        res.status(404).json({ message: "Пользователь не найден" });
        return;
      }
  
      if (!user.posts) {
        res.status(404).json({message: "Ошибка постов"})
        return
      }
  
      user.posts.push(newPost._id);
  
      await user.save(); 
  
      res.status(201).json(newPost);
    } catch (error) {
      
      console.error(error);
      res.status(500).json({ message: "Ошибка при создании поста" });
    }
  };

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) res.status(404).json({ message: "Пост не найден" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении поста" });
  }
};

export const updatePost = async (req: RequestWithUser, res: Response): Promise<void> => {
    if (!req.user?.id) {  
      res.status(401).json({ message: "Неавторизованный пользователь" });
      return;  
    }
  
    try {
      const { description, image } = req.body;
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        res.status(404).json({ message: "Пост не найден" });
        return;  
      }
  
      if (post.author.toString() !== req.user.id) {
        res.status(403).json({ message: "Нет прав для редактирования" });
        return;  
      }
  
      if (description !== undefined) {
        post.description = description;
      }
      if (image !== undefined) {
        post.image = image;
      }
  
      await post.save();
      res.json(post); 
  
    } catch (error) {
      res.status(500).json({ message: "Ошибка при обновлении поста" });
    }
  };
  
  
  export const deletePost = async (req: RequestWithUser, res: Response): Promise<void> => {
    if (!req.user?.id) {  
      res.status(401).json({ message: "Неавторизованный пользователь" });
      return; 
    }
  
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        res.status(404).json({ message: "Пост не найден" });
        return;  
      }
  
      if (post.author.toString() !== req.user.id) {
        res.status(403).json({ message: "Нет прав для удаления" });
        return;  
      }
  
      await post.deleteOne();
      res.json({ message: "Пост удалён" });
  
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении поста" });
    }
  };
  