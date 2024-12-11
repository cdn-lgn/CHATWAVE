export cont sendMessage = (senderID,receiverID,content,chatID)=>{
	try {
		

	    res.status(200).json({
	      message: "success",
	      success: true,
	    });
	} catch (error) {
	    console.log(error.message);
	    res.status(500).json({
	        message: "failed",
	        success: false,
	    });
	}
}