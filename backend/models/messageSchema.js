import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Chat", // Links each message to a chat
      required: true 
    },
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    receiverId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    type: {
      type: String, 
      required: true, 
      enum: ["text", "image", "video", "file"],
    },
    message: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);
