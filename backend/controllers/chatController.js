import Chat from "../models/chatSchema.js";

export const fetchAllChats = async (req, res) => {
    try {
        const userID = req.user.id;
        const allChats = await Chat.find({ participants: userID })
            .populate("participants", "_id name profileImage")
            .populate("group", "_id name profileImage")
            .exec();

        const transformedChats = allChats.map((chat) => {
            // console.log(userID)
            // console.log(chat.participants)
            // console.log(chat.participants[0]._id==userID)
            // console.log(chat.participants[1]._id==userID)
            if (chat.isGroupChat) {
                return {
                    _id:chat._id,
                    chatID:chat._id,
                    isGroupChat: true,
                    group: {
                        groupID: chat.group._id,
                        profileImage: chat.group.profileImage,
                        name: chat.group.name,
                    },
                    lastMessage: chat.lastMessage,
                };
            } else {
                return {
                    _id:chat._id,
                    chatID:chat._id,
                    isGroupChat: false,
                    participant: chat.participants.find(
                        (participant) => participant._id != userID,
                    ),
                    lastMessage: chat.lastMessage,
                };
            }
        });
        res.status(200).json({
            message: "success",
            success: true,
            allChats: transformedChats,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "failed",
            success: false,
        });
    }
};

export const createChat = async (req, res) => {
    try {
        const senderID = req.user.id;
        const { receiverID, groupID, content, isGroupChat } = req.body;

        let chat;
        if (isGroupChat) {
            chat = await Chat.findOne({
                participants: senderID,
                group: groupID,
            }).populate("group", "_id name profileImage");
        } else {
            chat = await Chat.findOne({
                participants: { $all: [senderID, receiverID] },
            }).populate("participants", "_id name profileImage");
        }

        if (!chat) {
            if (isGroupChat) {
                chat = new Chat({
                    isGroupChat: true,
                    group: groupID,
                    participants: [senderID],
                    lastMessage: content,
                });
                await chat.save();
                chat = await chat.populate("group", "_id name profileImage");
            } else {
                chat = new Chat({
                    isGroupChat: false,
                    participants: [senderID, receiverID],
                    lastMessage: content,
                });
                await chat.save();
                chat = await chat.populate(
                    "participants",
                    "_id name profileImage",
                );
            }
        }

        // Format the chat for response
        const formattedChat = {
            _id: chat._id,
            chatID:chat._id,
            isGroupChat: chat.isGroupChat,
            lastMessage: chat.lastMessage,
            ...(chat.isGroupChat
                ? {
                      group: {
                          groupID: chat.group._id,
                          profileImage: chat.group.profileImage,
                          name: chat.group.name,
                      },
                  }
                : {
                      participant: chat.participants.find(
                          (participant) =>
                              participant._id.toString() !== senderID,
                      ),
                  }),
        };
        res.status(200).json({
            message: "success",
            success: true,
            chat: formattedChat,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "failed",
            success: false,
        });
    }
};



export const updateChat = async ({
    chatID,
    senderID,
    receiverID,
    content,
    isGroupChat=false,
    groupID,
}) => {
    // console.log(chatID)
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatID,
            { lastMessage: content },
            { new: true }
        ).populate(
            isGroupChat ? "group" : "participants",
            "_id name profileImage"
        );

        if (!updatedChat) {
            throw new Error("Chat not found");
        }

        const formattedChat = {
            _id: updatedChat._id,
            chatID:updatedChat._id,
            isGroupChat: updatedChat.isGroupChat,
            lastMessage: updatedChat.lastMessage,
            ...(updatedChat.isGroupChat
                ? {
                      group: {
                          groupID: updatedChat.group._id,
                          profileImage: updatedChat.group.profileImage,
                          name: updatedChat.group.name,
                      },
                  }
                : {
                      participant: updatedChat.participants.find(
                          (participant) => participant._id.toString() === senderID
                      ),
                  }),
        };
        return formattedChat;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

