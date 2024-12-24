import cookie from "cookie"; 
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js"; 
import dotenv from "dotenv"; // Import dotenv

dotenv.config(); 

export const ioAuthMiddleware = async (socket, next) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    socket.user = user;
    next(); 
  } catch (error) {
    console.error("Socket Authentication Error:", error);
    next(new Error("Authentication error")); 
  }
};