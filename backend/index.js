import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"; // Missing import
import connectDB from "./config/db.js";
import userAuthRoute from "./routes/userRoutes.js";
import searchRoute from "./routes/searchRoute.js";
import groupRoute from "./routes/groupRoute.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { Server } from "socket.io";
import { ioAuthMiddleware } from "./middleware/ioAuthMiddleware.js";
import { createOrFindGroupChat, createOrFindPrivateChat } from "./controllers/chatController.js";

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
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

const onlineUsers = new Map();

io.use(ioAuthMiddleware);
io.on("connection", (socket) => {
  try {
    const { _id, name, profileImage } = socket.user; 
    console.log("User Connected:", name);

    onlineUsers.set(_id.toString(), { socketId: socket.id, name, profileImage });

   socket.on("send_message", async (data) => {
    try {
    console.log(data);
    const {chatID,receiverID,senderID,content,groupID,isGroupChat} = data
        let chat;
        if (isGroupChat) {
          if(chatID){
            chat = await createOrFindGroupChat({senderID, groupID,chatID, content});
          }else{
            chat = await createOrFindGroupChat({senderID, receiverID, content});
          }
        } else {
            if(chatID){
            chat = await createOrFindPrivateChat({senderID, receiverID,chatID, content});
          }else{
            chat = await createOrFindPrivateChat({senderID, receiverID, content});
          }
        }

        const receiverSocketId = onlineUsers.get(receiverID)?.socketId;

        const messageData = {
            senderID,
            content,
            chat,
        };
    

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive_message", messageData);
        }
        socket.emit("receive_message", messageData);

    } catch (err) {
        console.error("Error in send_message event:", err.message);
    }
});


    // Handle user disconnect
    socket.on("disconnect", () => {
      try {
        onlineUsers.delete(_id); // Remove the user from the online users map
        console.log(`User with ID ${_id} disconnected.`);
      } catch (err) {
        console.error("Error in disconnect event:", err.message);
      }
    });

  } catch (err) {
    console.error("Error during socket connection:", err.message);
  }
});


// Server Listening
const PORT = 3000;
server.listen(PORT, () => {
  console.log("Server started at port", PORT);
  connectDB();
});
