import sharp from "sharp";
import multer, { StorageEngine } from "multer";
import { Request, Response, NextFunction } from "express";

const storage: StorageEngine = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } 
});

const processImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return next();

    const compressedBuffer = await sharp(req.file.buffer)
      .resize(800, 800, { fit: "inside" }) 
      .jpeg({ quality: 70 }) 
      .toBuffer();

    const base64Image = `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;
    req.body.image = base64Image;
    next();
  } catch (error) {
    console.error("Ошибка при обработке изображения:", error);
    res.status(500).json({ error: "Ошибка при обработке изображения" });
  }
};

export { upload, processImage };

