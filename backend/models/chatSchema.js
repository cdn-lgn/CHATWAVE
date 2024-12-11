import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: {
      type: Boolean,
      default: false, // False for peer-to-peer chats
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the user schema
        required: true,
      },
    ],
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // References the group schema if it's a group chat
      default: null,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // Store the last message for quick access
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

export default mongoose.model("Chat", chatSchema);
