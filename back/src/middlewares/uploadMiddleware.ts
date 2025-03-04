import multer, { StorageEngine } from "multer";

const storage: StorageEngine = multer.memoryStorage();
const upload = multer({ storage });

const processImage = (req: any, res: any, next: any) => {
  if (!req.file) {
    return next(); 
  }

  const base64Image = req.file.mimetype + ";base64," + req.file.buffer.toString("base64");

  req.body.avatar = `data:${base64Image}`;
  
  next();
};

export { upload, processImage };
