import Message from "../models/messageSchema.js"

export const sendMessage = async (req, res) => {
    try {
        const { senderID, receiverID, content, chatID } = req.body;

        const newMessage = new Message({
            senderID,
            receiverID,
            content,
            chatID,
            timestamp: new Date()
        });

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


export const fetchChatMessages = async (req, res) => {
    try {
        const chatId = req.params.id; 

        const chatMessages = await Message.find({ chatId });

        res.status(200).json({
            message: "success",
            success: true,
            chatMessages,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "failed",
            success: false,
        });
    }
};
