import  express, { Application, Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import likeRoutes from "./routes/likeRoutes";
import commentRoutes from "./routes/commentRoutes"

const app: Application = express()
app.use(express.json())

app.use("/auth", authRouter)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)
app.use("/posts", likeRoutes);
app.use("/posts", commentRoutes);


export default app