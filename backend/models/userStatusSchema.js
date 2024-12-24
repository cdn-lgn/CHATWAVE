import mongoose from "mongoose"
const userStatusSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        isOnline: { type: Boolean, default: false },
        lastSeen: { type: Date, default: null },
    },
    { timestamps: true }
);

export default mongoose.model("UserStatus", userStatusSchema);
