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
import { createChat,updateChat } from "./controllers/chatController.js";
import { createMessage } from "./controllers/messageController.js";

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

        onlineUsers.set(_id.toString(), {
            socketId: socket.id,
            name,
            profileImage,
        });

        socket.on("send_message", async (data) => {
            const {
                senderID,
                receiverID,
                chatID,
                content,
                isGroupChat,
                groupID,
                isGroupMessage
            } = data;
            console.log(data)
            try {
                let chatObj;
                chatObj = await updateChat({
                    senderID,
                    receiverID,
                    isGroupChat,
                    groupID,
                    chatID,
                    content,
                });
                // console.log(chatObj)
               
                const messageObj = await createMessage({
    chatID,
    senderID,
    receiverID,
    isGroupMessage,
    groupID,
    content,
});

                const incomingData = { chatObj, messageObj };
                console.log("receive_id ===> ",receiverID)
                const receiverSocketId = onlineUsers.get(receiverID)?.socketId;
                // console.log(receiverSocketId)
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit(
                        "receive_message",
                        incomingData,
                    );
                }
                socket.emit("receive_message", incomingData);
            } catch (err) {
                console.error("Error in send_message event:", err.message);
            }
        });

        socket.on("disconnect", () => {
            onlineUsers.delete(_id);
            console.log(`User with ID ${_id} disconnected.`);
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
