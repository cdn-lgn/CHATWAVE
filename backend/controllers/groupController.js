import imageKit from "../config/imagekit.js";
import User from "../models/userSchema.js";
import Group from "../models/groupSchema.js"; // Ensure the Group model is imported
import { addToGroupChat,removeFromGroupChat } from "./chatController.js"; // Import createChat function

export const createGroup = async (req, res) => {
    try {
        // Validate input
        const { name, description } = req.body;
        if (!name || !description) {
            console.log("Name and description are required.");
            return res.status(400).json({
                message: "Name and description are required.",
                success: false,
            });
        }

        const file = req.file;
        if (!file) {
            console.log("Profile image is required.");
            return res.status(400).json({
                message: "Profile image is required.",
                success: false,
            });
        }

        const uploadedImage = await imageKit.upload({
            file: file.buffer,
            fileName: `${Date.now()}-${file.originalname}`,
            folder: "chatwave/groupProfile",
        });

        // Create a new group
        let group = await Group.create({
            name,
            description,
            owner: req.user.id, // Assuming `req.user` is set by auth middleware
            profileImage: uploadedImage.url,
            members: [req.user.id], // Initially, the owner is added as a member
        });

        // Create a chat for the group and add the owner as a participant
        const chat = await addToGroupChat(group._id, req.user.id); // Assuming createChat handles chat creation
        console.log(chat)
        await group.save();
        group.chatID = chat._id; // Save the chat ID to the group

        console.log("======>",group)
        console.log("======>",chat)

        // Respond with the created group
        return res.status(201).json({
            message: "Group created successfully!",
            success: true,
           chat,
group
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while creating the group.",
            success: false,
        });
    }
};

// Add single member (Owner can add members)
export const addSingleMember = async (req, res) => {
    try {
        const { member, groupID } = req.body;
        const userID = req.user.id;

        // Check if the user is the owner of the group
        const group = await Group.findOne({
            _id: groupID,
            owner: userID, // Only allow the owner to add members
        });

        if (!group) {
            return res.status(403).json({
                message: "You are not authorized to add members or group not found.",
                success: false,
            });
        }

        // Check if the member is already in the group
        if (group.members.includes(member)) {
            return res.status(400).json({
                message: "Member is already in the group",
                success: false,
            });
        }

        // Add member to the group
        group.members.push(member);
        await group.save();

        // Optionally add the member to the group chat if necessary
        // Assuming there's a function `addToGroupChat` that handles this.
        await addToGroupChat(group.chatID, member); // If `addToGroupChat` needs the group chat ID

        res.status(200).json({
            message: "Member added successfully and added to the group chat.",
            success: true,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Failed to add member",
            success: false,
        });
    }
};

// Remove single member (Owner can remove members)
export const removeSingleMember = async (req, res) => {
    try {
        const { member, groupID } = req.body;
        const userID = req.user.id;

        // Check if the user is the owner of the group
        const group = await Group.findOne({
            _id: groupID,
            owner: userID, // Only allow the owner to remove members
        });

        if (!group) {
            return res.status(403).json({
                message: "You are not authorized to remove members or group not found.",
                success: false,
            });
        }

        // Check if the member is part of the group
        if (!group.members.includes(member)) {
            return res.status(400).json({
                message: "Member not found in the group",
                success: false,
            });
        }

        // Remove the member from the group
        group.members = group.members.filter((memberID) => memberID.toString() !== member);
        await group.save();

        // Now, remove this member from the group chat
        await removeFromGroupChat(group.chatID, member); // Assuming removeFromGroupChat uses the chatID

        res.status(200).json({
            message: "Member removed successfully and removed from the group chat.",
            success: true,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Failed to remove member",
            success: false,
        });
    }
};

// Get all group members
export const getGroupMembers = async (req, res) => {
    try {
        const { groupID } = req.params;
        const group = await Group.findById(groupID).select("members");

        if (!group) {
            return res.status(404).json({
                message: "Group not found",
                success: false,
            });
        }

        // Fetch the users based on member IDs, but only return _id, name, profileImage
        const members = await User.find({ "_id": { $in: group.members } }).select("_id name profileImage");

        res.status(200).json({
            success: true,
            members,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Failed to fetch group members",
            success: false,
        });
    }
};
