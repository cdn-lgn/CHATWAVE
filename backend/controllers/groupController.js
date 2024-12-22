import imageKit from "../config/imagekit.js";
import User from "../models/userSchema.js";
import Group from "../models/groupSchema.js"; // Ensure the Group model is imported
import { createAndAddToGroupChat,removeFromGroupChat } from "./chatController.js"; // Import createChat function


export const fetchAllGroups = async(req,res)=>{
    try {
        const userID = req.user.id

        const allGroups = await Group.find({owner:userID}).populate("owner","name profileImage _id")

        res.status(200).json({
          message: "success",
          success: true,
          allGroups
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed",
            success: false,
        });
    }
}

export const fetchGroup = async(req,res)=>{
    try {
        const {groupID} = req.body

        const allGroups = await Group.findById().populate("owner","name profileImage _id")

        res.status(200).json({
          message: "success",
          success: true,
          group
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed",
            success: false,
        });
    }
}


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
        const chat = await createAndAddToGroupChat(group._id, req.user.id); // Add owner to group chat
        console.log(chat);
        
        // Save the group with the chat ID
        group.chatID = chat._id;
        await group.save();

        return res.status(201).json({
            message: "Group created successfully!",
            success: true,
            chat,
            group,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while creating the group.",
            success: false,
        });
    }
};


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

        // Add member to the group chat
        await createAndAddToGroupChat(group._id, member); // Add to group chat

        res.status(200).json({
            message: "Member added successfully and added to the group chat.",
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to add member",
            success: false,
        });
    }
};


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
        await removeFromGroupChat(group._id, member); // Remove from group chat

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


export const getGroupMembersForMessage = async (groupID) => {
    try {
        const group = await Group.findById(groupID);
        if (!group) {
            console.log("Group not found");
            return [];
        }
        const memberIds = group.members;
        console.log("Member IDs: ", memberIds);
        return memberIds;
    } catch (error) {
        console.log("Error fetching group members: ", error);
        return [];
    }
};
