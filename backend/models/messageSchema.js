import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User",required: true },
    recevierId: { type: mongoose.Schema.Types.ObjectId, ref: "User",required: true },
    type:{type:String,required: true}
    message: { type: String,required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);