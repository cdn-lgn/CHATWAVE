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
                    groupId: chat.group?._id || null, // Group ID
                    name: chat.group?.name || "Unnamed Group", // Group name
                    profileImage: chat.group?.profileImage || null, // Group profile image
                    chatId: chat._id,
                    lastMessage: chat.lastMessage|| "No messages yet", // Last message
                };
            } else {
                const secondUser = chat.participants.find(participant => participant._id.toString() !== userID.toString());
                return {
                    isGroupChat: false,
                    name: secondUser?.name || "Unknown User", // Name of the second participant
                    participantId: secondUser?._id || null, // ID of the second participant
                    chatId: chat._id,
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



export const createOrFindGroupChat = async (senderID, receiverID, content) => {
    console.log("senderID", senderID, "groupID", receiverID, 'content', content);

    try {
        // Search for an existing group chat with the sender as a participant and group as receiverID
        let chat = await Chat.findOneAndUpdate(
            {
                participants: { $in: [senderID] }, // Sender is a participant
                group: receiverID, // Group chat will have the receiver as group._id
                isGroupChat: true, // It's a group chat
            },
            { lastMessage: content }, // Update last message
            { new: true }
        )
        .populate('participants', 'name profileImage')
        .populate('group', 'name profileImage'); // Populate group data

        if (!chat) {
            // If no chat is found, create a new one for the group
            const chatData = {
                isGroupChat: true,
                participants: [senderID], // Only the sender is listed as a participant
                group: receiverID, // Receiver ID is the group._id
                lastMessage: content, // Add the last message
            };

            chat = await Chat.create(chatData);
            chat = await Chat.findById(chat._id)
                .populate('participants', 'name profileImage')
                .populate('group', 'name profileImage');
        }

        return {
            isGroup: true,
            groupId: chat.group?._id || null, // Group ID
            name: chat.group?.name || "Unnamed Group", // Group name
            profileImage: chat.group?.profileImage || null, // Group profile image
            chatId: chat._id,
            lastMessage: chat.lastMessage || "No messages yet", // Last message
        };
    } catch (err) {
        console.error(err.message);
        throw new Error("Error in createOrFindGroupChat: " + err.message);
    }
};


export const createOrFindPrivateChat = async (senderID, receiverID, content) => {
    console.log("senderID", senderID, "receiverID", receiverID, 'content', content);

    try {
        // Search for an existing private chat with both participants
        let chat = await Chat.findOneAndUpdate(
            {
                participants: { $all: [senderID, receiverID] }, // Both users must be participants
                isGroupChat: false, // Ensure it's not a group chat
            },
            { lastMessage: content }, // Update last message
            { new: true }
        )
        .populate('participants', 'name profileImage'); // Populate participant data

        if (!chat) {
            // If no chat is found, create a new one for the private chat
            const chatData = {
                isGroupChat: false,
                participants: [senderID, receiverID], // Both participants in the chat
                lastMessage: content, // Add last message
            };

            chat = await Chat.create(chatData);
            chat = await Chat.findById(chat._id)
                .populate('participants', 'name profileImage');
        }

        // Find the second participant (not the sender)
        const secondUser = chat.participants.find(participant => participant._id.toString() !== senderID.toString());

        return {
            isGroup: false,
            name: secondUser?.name || "Unknown User", // Second participant's name
            participantId: secondUser?._id || null, // Second participant's ID
            chatId: chat._id,
            profileImage: secondUser?.profileImage || null, // Second participant's profile image
            lastMessage: chat.lastMessage || "No messages yet", // Last message
        };
    } catch (err) {
        console.error(err.message);
        throw new Error("Error in createOrFindPrivateChat: " + err.message);
    }
};


