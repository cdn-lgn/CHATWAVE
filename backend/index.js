import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"; // Missing import
import connectDB from "./config/db.js";
import userAuthRoute from "./routes/userRoutes.js";
import searchRoute from "./routes/searchRoute.js";
import groupRoute from "./routes/groupRoute.js";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    }),
);

// Log requests (development only)
if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
}

// Routes
app.use("/api/user", userAuthRoute);
app.use("/api/group", groupRoute);
app.use("/api/search", searchRoute);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  const { userId, name } = socket.handshake.query;
  onlineUsers.set(userId, socket.id);
  console.log("User  Connected:", name, socket.id);
  console.log("Current online users:", Array.from(onlineUsers.entries())); // Log online users

  socket.on("send_message", (data) => {
    const { senderID, receiverID, content } = data;
    const receiverSocketId = onlineUsers.get(receiverID);
    console.log(content)

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", { senderID, content });
    } else {
      console.log(`Receiver with ID ${receiverID} is not online.`);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    console.log("User  Disconnected:", name);
  });
});

// Server Listening
const PORT = 3000;
server.listen(PORT, () => {
    console.log("Server started at port", PORT);
    connectDB();
});
