import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Exclude by default
    profileImage: { type: String, required: true },
    about: { type: String },
    hideAccount: { type: Boolean},
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Blocked users
    lastSeen: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
