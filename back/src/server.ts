import "dotenv/config"
import connectDb from "./config/db";
import app from "./app";

connectDb()

const PORT : number | string = process.env.PORT || 3333

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})