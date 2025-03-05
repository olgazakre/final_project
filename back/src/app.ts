import  express, { Application, Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes"

const app: Application = express()
app.use(express.json())

app.use("/auth", authRouter)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)


export default app