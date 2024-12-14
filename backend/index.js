import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"; // Missing import
import connectDB from "./config/db.js";
import userAuthRoute from "./routes/userRoutes.js";
import userStatusRoute from "./routes/userStatusRoute.js";
import searchRoute from "./routes/searchRoute.js";
import groupRoute from "./routes/groupRoute.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { Server } from "socket.io";
import { ioAuthMiddleware } from "./middleware/ioAuthMiddleware.js";
import { createChat, updateChat } from "./controllers/chatController.js";
import { createMessage } from "./controllers/messageController.js";
import User from "./models/userSchema.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.76.115:5173"],
        credentials: true,
    },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        // origin: process.env.FRONTEND_URL || "http://localhost:5173",
        origin: ["http://localhost:5173", "http://192.168.76.115:5173"],
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
app.use("/api/userStatus", userStatusRoute);
app.use("/api/group", groupRoute);
app.use("/api/search", searchRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

const onlineUsers = new Map();

io.use(ioAuthMiddleware);
io.on("connection", async (socket) => {
    try {
        const userID = socket.user?._id.toString(); // Access the authenticated user
        await User.findByIdAndUpdate(userID, { status: "online" });
        if (!userID) {
            console.log("User ID not available");
            return;
        }
        console.log("User connected:", userID);
        onlineUsers.set(userID, {
            socketId: socket.id,
            status: "online",
            userID,
        });

        io.emit("user_status_change", { userID, status: "online" });

        socket.on("user_typing_status", (data) => {
            console.log("Typing status:", onlineUsers.get(data.receiverID));
            const receiverSocketId = onlineUsers.get(data.receiverID)?.socketId;
            socket.to(receiverSocketId).emit("user_typing_status", data);
        });

        socket.on("send_message", async (data) => {
            const {
                senderID,
                receiverID,
                chatID,
                content,
                isGroupChat,
                groupID,
                isGroupMessage,
            } = data;
            console.log(data);
            try {
                let chatObj = await updateChat({
                    senderID,
                    receiverID,
                    isGroupChat,
                    groupID,
                    chatID,
                    content,
                });

                const messageObj = await createMessage({
                    chatID,
                    senderID,
                    receiverID,
                    isGroupMessage,
                    groupID,
                    content,
                });

                const incomingData = { chatObj, messageObj };
                const receiverSocketId = onlineUsers.get(receiverID)?.socketId;

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

        //=================//
        // webRTC response start
        //=================//
        socket.on("offer", ({ offer, senderID, receiverID }) => {
            const receiverSocketId = onlineUsers.get(receiverID)?.socketId;
            console.log("Offer received from", socket.id);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("incomingCall", {
                    offer,
                    senderID,
                    receiverID,
                });
            } else {
                console.log("Receiver not available");
            }
        });
        socket.on("answer", ({ answer, senderID, receiverID }) => {
            const receiverSocketId = onlineUsers.get(receiverID)?.socketId;
            console.log("Answer received from", socket.id);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("callAnswered", {
                    answer,
                    senderID,
                    receiverID,
                });
            } else {
                console.log("Caller not available");
            }
        });
        socket.on("ice-candidate", ({ candidate, senderID, receiverID }) => {
            const receiverSocketId = onlineUsers.get(receiverID)?.socketId;

            console.log("ICE candidate received:", candidate);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("iceCandidate", {
                    candidate,
                    senderID,
                    receiverID,
                });
            }
        });
        socket.on("endCall", (targetUserId) => {
            const receiverSocketId = onlineUsers.get(targetUserId)?.socketId;
            console.log("Call ended by user:", socket.id);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("endCall", { from: socket.id });
            }
        });
        //=================//
        // webRTC response end
        //=================//

        socket.on("disconnect", async () => {
            if (userID) {
                onlineUsers.delete(userID);
                io.emit("user_status_change", { userID, status: "offline" });
                try {
                    await User.findByIdAndUpdate(userID, {
                        status: Date.now(),
                    });
                } catch (err) {
                    console.error(
                        "Error updating user status on disconnect:",
                        err.message,
                    );
                }
                console.log(`User with ID ${userID} disconnected.`);
            }
        });
    } catch (err) {
        console.error("Error during socket connection:", err.message);
    }
});

// Server Listening
const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log("Server started at port", PORT);
    connectDB();
});
