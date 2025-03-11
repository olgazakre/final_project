import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import postRoutes from "./routes/postRoutes";
import likeRoutes from "./routes/likeRoutes";
import commentRoutes from "./routes/commentRoutes";
import searchRoutes from "./routes/searchRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import notificationRoutes from "./routes/notificationRoutes";

const app: Application = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}));

app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", profileRoutes);
app.use("/posts", postRoutes);
app.use("/liked", likeRoutes);
app.use("/posts", commentRoutes); 
app.use("/search", searchRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/notification", notificationRoutes); 


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Ошибка сервера:", err.message);
  res.status(500).json({ message: "Ошибка сервера", error: err.message });
});

export default app;
