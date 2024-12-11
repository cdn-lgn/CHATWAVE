import Chat from "../models/chatSchema.js"

export const fetchALlChats = async(req,res)=>{
	try {
		const userID = req.user.id;
        const allChats = await Chat.find({ participants: userID });
	    res.status(200).json({
	      message: "success",
	      success: true,
	      allChats
	    });
	} catch (error) {
	    console.log(error.message);
	    res.status(500).json({
	        message: "failed",
	        success: false,
	    });
	}
}

export const findOrCreateChat = async (senderID, receiverID, content) => {
  try {
    let chat = await Chat.findOneAndUpdate(
      {
        isGroupChat: false,
        participants: { $all: [senderID, receiverID] },
      },
      { lastMessage: content }, 
            { new: true }
    );

    // If chat doesn't exist, create it
    if (!chat) {
      const chatData = {
        isGroupChat: false,
        participants: [senderID, receiverID],
        group: null,
        lastMessage: content,
      };

      chat = await Chat.create(chatData);
    }

    return chat;
  } catch (err) {
    throw new Error("Error in findOrCreateChat: " + err.message);
  }
};