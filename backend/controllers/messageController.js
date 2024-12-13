import Message from "../models/messageSchema.js";
import Chat from "../models/chatSchema.js";

export const fetchChatMessages = async (req, res) => {
    try {
        const chatID = req.params.id;
        const userID = req.user.id;

        const allMessages = await Message.find({
            chat: chatID,
            $or: [{ sender: userID }, { receiver: userID }],
        })
            .populate("sender", "_id name profileImage")
            .populate("receiver", "_id name profileImage")
            .populate("group", "_id name profileImage");

        const formattedMessages = allMessages.map((message) => {
            if (message.isGroupMessage) {
                return {
                    _id: message._id,
                    chatID: message.chat._id,
                    sender: message.sender,
                    isGroupMessage: true,
                    group: message.group,
                    content: message.content,
                };
            } else {
                return {
                    _id: message._id,
                    chatID: message.chat._id,
                    sender: message.sender,
                    isGroupMessage: false,
                    receiver: message.receiver,
                    content: message.content,
                };
            }
        });
        res.status(200).json({
            message: "success",
            success: true,
            allMessages: formattedMessages,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Failed to fetch messages",
            success: false,
            error: error.message,
        });
    }
};


export const createMessage = async ({ chatID, senderID, receiverID, isGroupMessage = false, groupID = null, content }) => {
    try {
        let messageObject;

        // Create message object based on whether it's a group message or a direct message
        if (isGroupMessage) {
            messageObject = {
                isGroupMessage: true,
                group: groupID,
                sender: senderID,
                content: content,
                chat: chatID
            };
        } else {
            messageObject = {
                isGroupMessage: false,
                receiver: receiverID,
                sender: senderID,
                content: content,
                chat: chatID
            };
        }

        // Create the new message in the database
        const newMessage = await Message.create(messageObject);

        // Use find() to get the message with populated fields
        const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "_id name profileImage")
            .populate("receiver", "_id name profileImage")
            .populate("group", "_id name profileImage");

        // Return the message in the same format as the fetchChatMessages response
        const formattedMessage = {
            _id: populatedMessage._id,
            chatID: populatedMessage.chat._id,  // Ensure the chat ID is returned correctly
            sender: populatedMessage.sender,    // Include the sender data
            isGroupMessage: populatedMessage.isGroupMessage,
            content: populatedMessage.content,
            ...(populatedMessage.isGroupMessage
                ? { group: populatedMessage.group }  // Include group data if it's a group message
                : { receiver: populatedMessage.receiver }) // Include receiver data if it's a direct message
        };

        return formattedMessage;

    } catch (error) {
        console.log(error);
        throw new Error("Error creating message");
    }
};

