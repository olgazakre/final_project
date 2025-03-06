import  express, { Application, Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import postRoutes from "./routes/postRoutes";
import likeRoutes from "./routes/likeRoutes";
import commentRoutes from "./routes/commentRoutes"
import searchRoutes from "./routes/searchRoutes"

const app: Application = express()
app.use(express.json())

app.use("/auth", authRouter)
app.use("/users", profileRoutes)
app.use("/posts", postRoutes)
app.use("/posts", likeRoutes);
app.use("/posts", commentRoutes);
app.use('/search', searchRoutes)


export default app