import multer, { StorageEngine } from "multer";
import { Request, Response, NextFunction } from "express";

const storage: StorageEngine = multer.memoryStorage();
const upload = multer({ storage });

const processImage = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  
  req.body.image = base64Image; 
  next();
};

export { upload, processImage };
