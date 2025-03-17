import multer, { StorageEngine } from "multer";
import sharp from "sharp";

const storage: StorageEngine = multer.memoryStorage();
const upload = multer({ storage });

const processImage = async (req: any, res: any, next: any) => {
  try {
    if (!req.file) {
      return next();
    }

    const resizedBuffer = await sharp(req.file.buffer)
      .resize({ width: 800 }) 
      .jpeg({ quality: 60 })  
      .toBuffer();

    const base64Image = `data:image/jpeg;base64,${resizedBuffer.toString("base64")}`;

    req.body.avatar = base64Image;
    next();
  } catch (error) {
    console.error("Ошибка обработки изображения:", error);
    res.status(500).json({ message: "Ошибка обработки изображения" });
  }
};

export { upload, processImage };
