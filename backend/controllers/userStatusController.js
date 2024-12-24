import UserStatus from "../models/userStatusSchema.js";

export const userStatus = async(req,res)=> {
    try {
        const userStatus = await UserStatus.findOne({ user: req.params.id }).populate("user", "name profileImage");

        if (userStatus) {
            res.status(200).json({
                isOnline: userStatus.isOnline,
                lastSeen: userStatus.lastSeen,
                typingIn: userStatus.typingIn,
            });
        } else {
            res.status(404).json({ message: "User status not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching user status", error: error.message });
    }
}
