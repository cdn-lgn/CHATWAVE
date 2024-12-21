import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Exclude by default
    profileImage: { type: String, required: true },
    about: { type: String },
    hiddenAccount: { type: Boolean,default:false,required:true },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Blocked users
    status: { type: String, default:"offline" },
    entityType: { type: String, default: "user", immutable: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
