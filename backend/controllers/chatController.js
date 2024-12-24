import Chat from "../models/chatSchema.js";
import moment from "moment";

export const fetchAllChats = async (req, res) => {
    try {
        const userID = req.user.id;
        const allChats = await Chat.find({ participants: userID })
            .populate("participants", "_id name profileImage status about")
            .populate("group", "_id name profileImage description")
            .populate({
                path: "group", // Populating groups array
                populate: {
                    path: "owner", // Populating owner inside each group
                    select: "name profileImage _id", // Fields to select for owner
                },
            })
            .exec();

        // console.log(allChats);

        const transformedChats = allChats.map((chat) => {
            const participant = chat.isGroupChat
                ? null
                : chat.participants.find((p) => p._id.toString() !== userID);

            let participantStatus = "offline";

            if (participant && participant.status) {
                if (participant.status === "online") {
                    participantStatus = "online";
                } else if (participant.status === "offline") {
                    participantStatus = "offline";
                } else {
                    const statusTimestamp = parseInt(participant.status, 10);

                    if (!isNaN(statusTimestamp)) {
                        const lastActiveTime = moment(statusTimestamp);
                        const minutesAgo = moment().diff(
                            lastActiveTime,
                            "minutes",
                        );
                        const hoursAgo = moment().diff(lastActiveTime, "hours");
                        const daysAgo = moment().diff(lastActiveTime, "days");

                        if (minutesAgo < 60) {
                            participantStatus = `${minutesAgo} minute(s) ago`;
                        } else if (hoursAgo < 24) {
                            participantStatus = `${hoursAgo} hour(s) ago`;
                        } else {
                            participantStatus =
                                lastActiveTime.format("MMMM Do YYYY"); // Date without time
                        }
                    } else {
                        participantStatus = "offline"; // Default to offline if parsing fails
                    }
                }
            }
            if (chat.isGroupChat) {
                return {
                    _id: chat._id,
                    chatID: chat._id,
                    isGroupChat: true,
                    group: {
                        _id: chat.group._id,
                        profileImage: chat.group.profileImage,
                        name: chat.group.name,
                        description: chat.group.description,
                        owner: {
                            name: chat.group.owner.name,
                            profileImage: chat.group.owner.profileImage,
                            _id: chat.group.owner._id,
                        },
                    },

                    lastMessage: chat.lastMessage,
                };
            } else {
                return {
                    _id: chat._id,
                    chatID: chat._id,
                    isGroupChat: false,
                    participant: {
                        _id: participant?._id,
                        name: participant?.name,
                        profileImage: participant?.profileImage,
                        status: participantStatus,
                        about: participant.about,
                    },
                    lastMessage: chat.lastMessage,
                };
            }
        });
        // console.log(chat)

        res.status(200).json({
            message: "success",
            success: true,
            allChats: transformedChats,
        });
    } catch (error) {
        console.error(error);
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
        // console.log("isGroupChat  ", isGroupChat)

        let chat;

if (isGroupChat) {
    chat = await Chat.findOne({
        isGroupChat: true, 
        group: groupID,
        participants: senderID, 
    }).populate("group", "_id name profileImage");
} else {
    chat = await Chat.findOne({
        isGroupChat: false,
        participants: { $all: [senderID, receiverID] },
        $expr: { $eq: [{ $size: "$participants" }, 2] }
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
            chatID: chat._id,
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

export const updateChat = async (req, res) => {
    try {
        const { chatID, content } = req.body;
        const updatedChat = await Chat.findByIdAndUpdate(
            chatID,
            { lastMessage: content },
            { new: true },
        );

        if (!updatedChat) {
            throw new Error("Chat not found");
        }

        // console.log(updateChat)
        res.status(200).json({
            message: "success",
            success: true,
            lastMessage: updatedChat.lastMessage,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "failed",
            success: false,
        });
    }
};

export const createAndAddToGroupChat = async (groupID, memberID) => {
    try {
        // Check if a group chat already exists for this group
        let groupChat = await Chat.findOne({ group: groupID });

        // If a group chat does not exist, create a new one
        if (!groupChat) {
            groupChat = new Chat({
                isGroupChat: true,
                participants: [memberID], // Adding the new member to the group chat
                group: groupID, // Reference to the group
                lastMessage: {
                    type: "text",
                    message: null,
                },
            });
            groupChat = await groupChat.save();
            groupChat = await Chat.findOne({ group: groupID });
        } else {
            // Group chat exists, add the member to the participants
            if (!groupChat.participants.includes(memberID)) {
                groupChat.participants.push(memberID);
                groupChat = await groupChat.save();
            }
        }
        groupChat = await groupChat.populate("group", "name _id profileImage");
        groupChat = { ...groupChat, chatID: groupChat._id };
        console.log(groupChat);
        console.log("User added to group chat successfully");
        return groupChat;
    } catch (error) {
        console.error("Error adding user to group chat:", error);
        throw new Error("Failed to add user to group chat");
    }
};

export const removeFromGroupChat = async (groupID, memberID) => {
    try {
        // Check if a group chat exists for this group
        const groupChat = await Chat.findOne({ group: groupID });

        if (!groupChat) {
            throw new Error("Group chat not found");
        }

        // If the user is in the participants list, remove them
        if (groupChat.participants.includes(memberID)) {
            groupChat.participants = groupChat.participants.filter(
                (participantID) =>
                    participantID.toString() !== memberID.toString(),
            );

            await groupChat.save();
            console.log("User removed from group chat successfully");

            // If there are no participants left in the group chat, consider deleting the chat
            if (groupChat.participants.length === 0) {
                await groupChat.delete();
                console.log(
                    "Group chat deleted as there are no participants left",
                );
            }
        }
    } catch (error) {
        console.error("Error removing user from group chat:", error.message);
        throw new Error("Failed to remove user from group chat");
    }
};
