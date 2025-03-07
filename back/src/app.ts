import  express, { Application, Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import postRoutes from "./routes/postRoutes";
import likeRoutes from "./routes/likeRoutes";
import commentRoutes from "./routes/commentRoutes"
import searchRoutes from "./routes/searchRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes"
import notificationRoutes from "./routes/notificationRoutes";

const app: Application = express()
app.use(express.json())

app.use("/auth", authRouter)
app.use("/users", profileRoutes)
app.use("/posts", postRoutes)
app.use("/liked", likeRoutes);
app.use("/posts", commentRoutes);
app.use('/search', searchRoutes);
app.use("/subscriptions", subscriptionRoutes)
app.use("/notification", notificationRoutes)


export default app