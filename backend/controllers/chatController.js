import Chat from "../models/chatSchema.js"

export const fetchAllChats = async (req, res) => {
    try {
        const userID = req.user.id;
        const allChats = await Chat.find({ participants: userID })
            .populate('participants', 'name profileImage') // Populate participants for personal chat
            .populate('group', 'name profileImage') // Populate group for group chat
            .exec();
        const transformedChats = allChats.map(chat => {
            if (chat.isGroupChat) {
                return {
                    isGroupChat: true,
                    groupID: chat.group?._id || null, // Group ID
                    name: chat.group?.name || "Unnamed Group", // Group name
                    profileImage: chat.group?.profileImage || null, // Group profile image
                    chatID: chat._id,
                    lastMessage: chat.lastMessage|| "No messages yet", // Last message
                };
            } else {
                const secondUser = chat.participants.find(participant => participant._id.toString() !== userID.toString());
                return {
                    isGroupChat: false,
                    name: secondUser?.name || "Unknown User", // Name of the second participant
                    participantID: secondUser?._id || null, // ID of the second participant
                    chatID: chat._id,
                    profileImage: secondUser?.profileImage || null, // Profile image of the second participant
                    lastMessage: chat.lastMessage|| "No messages yet", // Last message
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



export const createOrFindGroupChat = async ({senderID, groupID, chatID, content}) => {
    try {
        let chat;
        if (chatID) {
            chat = await Chat.findByIdAndUpdate(
                chatID,
                { lastMessage: content },
                { new: true }
            )
            .populate('participants', 'name profileImage')
            .populate('group', 'name profileImage');
        } else {
            chat = await Chat.findOneAndUpdate(
                {
                    participants: { $in: [senderID] },
                    group: groupID,
                    isGroupChat: true,
                },
                { lastMessage: content },
                { new: true }
            )
            .populate('participants', 'name profileImage')
            .populate('group', 'name profileImage');

            if (!chat) {
                const chatData = {
                    isGroupChat: true,
                    participants: [senderID],
                    group: groupID,
                    lastMessage: content,
                };

                chat = await Chat.create(chatData);
                chat = await Chat.findById(chat._id)
                    .populate('participants', 'name profileImage')
                    .populate('group', 'name profileImage');
            }
        }
        return {
            isGroup: true,
            groupID: chat.group?._id || null,
            name: chat.group?.name || "Unnamed Group",
            profileImage: chat.group?.profileImage || null,
            chatID: chat._id,
            lastMessage: chat.lastMessage || "No messages yet",
        };
    } catch (err) {
        console.error("Error in createOrFindGroupChat:", err.message);
        throw new Error("Error in createOrFindGroupChat: " + err.message);
    }
};


export const createOrFindPrivateChat = async ({senderID, receiverID, chatID, content}) => {
    try {
        let chat;
        if (chatID) {
            chat = await Chat.findByIdAndUpdate(
                chatID,
                { lastMessage: content },
                { new: true }
            )
            .populate('participants', 'name profileImage');
        } else {
            chat = await Chat.findOneAndUpdate(
                {
                    participants: { $all: [senderID, receiverID] },
                    isGroupChat: false,
                },
                { lastMessage: content },
                { new: true }
            )
            .populate('participants', 'name profileImage');

            if (!chat) {
                const chatData = {
                    isGroupChat: false,
                    participants: [senderID, receiverID],
                    lastMessage: content,
                };

                chat = await Chat.create(chatData);
                chat = await Chat.findById(chat._id)
                    .populate('participants', 'name profileImage');
            }
        }
        const secondUser = chat.participants.find(
            participant => participant._id.toString() !== senderID.toString()
        );

        return {
            isGroup: false,
            name: secondUser?.name || "Unknown User",
            participantID: secondUser?._id || null,
            chatID: chat._id,
            profileImage: secondUser?.profileImage || null,
            lastMessage: chat.lastMessage || "No messages yet",
        };
    } catch (err) {
        console.error("Error in createOrFindPrivateChat:", err.message);
        throw new Error("Error in createOrFindPrivateChat: " + err.message);
    }
};



