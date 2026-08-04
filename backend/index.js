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
import TFARoute from "./routes/twoFactorAuthRoute.js";
import { Server } from "socket.io";
import { ioAuthMiddleware } from "./middleware/ioAuthMiddleware.js";
import User from "./models/userSchema.js";
import { getGroupMembersForMessage } from "./controllers/groupController.js";
import crypto from "node:crypto";

dotenv.config();
if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}

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
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
    }),
);

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
// });

// Routes
app.use("/api/user", userAuthRoute);
app.use("/api/userStatus", userStatusRoute);
app.use("/api/groups", groupRoute);
app.use("/api/search", searchRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/TFA", TFARoute);

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
            // console.log("Typing status:", onlineUsers.get(data.receiverID));
            const receiverSocketId = onlineUsers.get(data.receiverID)?.socketId;
            socket.to(receiverSocketId).emit("user_typing_status", data);
        });

        socket.on(
            "group_message",
            async ({ updatedChat, groupID, newMessage }) => {
                try {
                    const memberIds = await getGroupMembersForMessage(groupID);
                    memberIds.forEach((memberId) => {
                        const userSocket = onlineUsers.get(memberId.toString());
                        if (userSocket) {
                            io.to(userSocket.socketId).emit(
                                "receive_group_message",
                                { updatedChat, newMessage },
                            );
                        }
                    });

                    console.log("Message sent to group members!");
                } catch (error) {
                    console.log("Error sending group message: ", error);
                }
            },
        );

        socket.on("add_chat", ({ createdChat, receiverID }) => {
            const receiverSocketId = onlineUsers.get(receiverID)?.socketId;
            io.to(receiverSocketId).emit("add_chat", { createdChat });
        });

        socket.on("send_message", async (data) => {
            try {
                const { updatedChat, newMessage, receiverID } = data;

                const receiverSocketId = onlineUsers.get(receiverID)?.socketId;

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", {
                        updatedChat,
                        newMessage,
                    });
                }
                socket.emit("receive_message", { updatedChat, newMessage });
                // socket.emit("message_delivered");
            } catch (err) {
                console.error("Error in send_message event:", err.message);
            }
        });

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

        // web RTC with Simple Peer
        socket.on("user-call", (data) => {
            const { sender, receiverID, signal } = data;
            const receiverSocketId = onlineUsers.get(receiverID)?.socketId;
            io.to(receiverSocketId).emit("user-call", { sender, signal });
            console.log(`call alert send by ${sender.name} to ${receiverID} `);
        });

        socket.on("answer-call", (data) => {
            const { senderID, receiverID, signal } = data;
            const receiverSocketId = onlineUsers.get(receiverID)?.socketId;
            io.to(receiverSocketId).emit("accepted-call", { senderID, signal });
        });

        socket.on("end-call", (data) => {
            const { receiverID } = data;
            const receiverSocketId = onlineUsers.get(receiverID)?.socketId;
            io.to(receiverSocketId).emit("end-call");
        });
    } catch (err) {
        console.error("Error during socket connection:", err);
    }
});

// Server Listening
const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log("Server started at port", PORT);
    connectDB();
});
