import Message from "../models/messageSchema.js";
import Chat from "../models/chatSchema.js";
import imageKit from "../config/imagekit.js";

export const fetchChatMessages = async (req, res) => {
    try {
        const chatID = req.params.id;
        const userID = req.user.id;

        const allMessages = await Message.find({
            chat: chatID
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

export const createMessage = async (req, res) => {
    try {
        const {
            chatID,
            senderID,
            receiverID,
            isGroupMessage,
            groupID,
            content,
        } = req.body;
console.log("create message receiverID ==> ",isGroupMessage)
        const file = req.file;

        let messageObject;

        // Handle file upload if present
        if (file) {
            const uploadImage = await imageKit.upload({
                file: file.buffer,
                fileName: file.originalname,
                folder: `chatwave/chats/${chatID}`,
            });

// console.log(file)
            // Construct messageObject for group and private messages when file is uploaded
            messageObject = {
                isGroupMessage : isGroupMessage,
                chat: chatID,
                sender: senderID,
                content: {
                    name: file.originalname,
                    type:  file.mimetype.split('/')[0]=="application" ? "pdf" : file.mimetype.split('/')[0],
                    message: uploadImage.url,
                },
            };

                console.log("groupID  ",messageObject)
            if (messageObject?.isGroupMessage=="true") {
                messageObject.group = groupID;
            } else {
                messageObject.receiver = receiverID;
            }
        } else {
            // Handle text message when no file is uploaded
            messageObject = {
                isGroupMessage : isGroupMessage,
                chat: chatID,
                sender: senderID,
                content,
            };

            if (messageObject?.isGroupMessage=="true") {
                messageObject.group = groupID;
            } else {
                messageObject.receiver = receiverID;
            }
        }

            // console.log(messageObject)
        // Create the new message in the database
        const newMessage = await Message.create(messageObject);

        // Populate the new message with sender, receiver, and group details
        const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "_id name profileImage")
            .populate("receiver", "_id name profileImage")
            .populate("group", "_id name profileImage");

// console.log(populatedMessage)
        // Format the response message to be returned
        const formattedMessage = {
            _id: populatedMessage._id,
            chatID: populatedMessage.chat._id,
            sender: populatedMessage.sender,
            isGroupMessage: populatedMessage.isGroupMessage,
            content: populatedMessage.content,
            ...(populatedMessage.isGroupMessage
                ? { group: populatedMessage.group }
                : { receiver: populatedMessage.receiver }),
        };

        // Respond with success and the formatted message
        res.status(200).json({
            message: "success",
            success: true,
            formattedMessage,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "failed",
            success: false,
        });
    }
};
