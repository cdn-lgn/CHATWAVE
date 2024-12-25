import mongoose from "mongoose"

const authSchema =new mongoose.Schema({

	user:{type: mongoose.Schema.Types.ObjectId,
			ref: "User",required:true},
	publicKey:{type:Object,required:true},
	// secretPassKey:{type:Number,required:true},
},{timeStamp:true}
)

export default mongoose.model("TwoFactorAuth",authSchema)