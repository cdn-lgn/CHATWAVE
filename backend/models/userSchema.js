import mongoose from "mongoose";

const userScheme = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String,required:true},
    about: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userScheme);
