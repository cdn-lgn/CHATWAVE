import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js";
import userAuthRoute from "./routes/userRoutes.js"


dotenv.config()
const app = express()
const corsOptions = {
    origin: "https://fluffy-eureka-wrrrq57wj456f9q5-5173.app.github.dev", // Replace with your frontend's URL
    credentials: true, // Allow cookies and other credentials
};

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors(corsOptions))
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


app.use('/api/user',userAuthRoute)

const PORT = 3000

app.listen(PORT,()=>{
    console.log("server started at port ",PORT)
    connectDB()
})