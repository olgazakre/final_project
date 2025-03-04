import  express, { Application, Request, Response } from "express";
import router from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes"

const app: Application = express()
app.use(express.json())
app.use("/user", router)
app.use("/users", userRoutes)


export default app