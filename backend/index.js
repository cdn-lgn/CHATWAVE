import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js";
import userAuthRoute from "./routes/userRoutes.js"
import searchRoute from "./routes/searchRoute.js"
import groupRoute from "./routes/groupRoute.js"


dotenv.config()
const app = express()
const corsOptions = {
    origin: "http://localhost:5173", // Replace with your frontend's URL
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
app.use('/api/group',groupRoute)
app.use('/api/search',searchRoute)

const PORT = 3000

app.listen(PORT,()=>{
    console.log("server started at port ",PORT)
    connectDB()
})