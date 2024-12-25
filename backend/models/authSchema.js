import mongoose from "mongoose"

const authSchema =new mongoose.Schema({
{
	user:{type:mongoose.Schema.Type.ObjectId,ref:"User",required:true},
	publicKey:{type:String,required:true},
	secretPassKey:{type:Number,required:true},
},{timeStamp:true}
})

export default mongoose.model("TwoFactorAuth",authSchema)