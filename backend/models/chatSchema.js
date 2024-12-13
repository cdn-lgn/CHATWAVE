import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    lastMessage: {
      type: {
        type: String,
        default: "text",
        required: true,
      },
      message: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Chat", chatSchema);
