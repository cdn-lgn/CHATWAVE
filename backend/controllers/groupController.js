import imageKit from '../config/imagekit.js';
import Group from '../models/groupSchema.js'; // Ensure the Group model is imported

export const createGroup = async (req, res) => {
	try {
		// Validate input
		const { name, description } = req.body;
		if (!name || !description) {
			console.log("Name and description are required.")
			return res.status(400).json({
				message: "Name and description are required.",
				success: false,
			});
		}

		// Validate file
		console.log(req)
		const file = req.file;
		if (!file) {
			console.log("Profile image is required.")
			return res.status(400).json({
				message: "Profile image is required.",
				success: false,
			});
		}

		// Upload the file to ImageKit
		const uploadedImage = await imageKit.upload({
			file: file.buffer, // File buffer from multer
			fileName: `${Date.now()}-${file.originalname}`, // Unique filename
		});

		// Create a new group
		const group = await Group.create({
			name,
			description,
			owner: req.user._id, // Assuming `req.user` is set by auth middleware
			profileImage: uploadedImage.url,
		});

		// Respond with the created group
		return res.status(201).json({
			message: "Group created successfully!",
			success: true,
			data: group,
		});
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			message: "An error occurred while creating the group.",
			success: false,
		});
	}
};
