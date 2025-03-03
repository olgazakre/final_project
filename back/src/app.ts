import  express, { Application, Request, Response } from "express";
import router from "./routes/authRoutes";

const app: Application = express()
app.use(express.json())
app.use("/user", router)


export default app