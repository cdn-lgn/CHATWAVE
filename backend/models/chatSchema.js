import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    isGroup: { type: Boolean, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            content: { type: String },
            attachments: [{ type: String }],
            createdAt: { type: Date, default: Date.now },
            deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        }
    ],
    groupDetails: {
        groupName: { type: String },
        groupImage: { type: String }
    },
    createdAt: { type: Date, default: Date.now },
});

// Export the model
export default mongoose.model("Chat", chatSchema);