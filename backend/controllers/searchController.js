import User from "../models/userSchema.js";
import Group from "../models/groupSchema.js";

export const searchAll = async (req, res) => {
	const { query } = req.query;

	try {
		const users = await User.find({
			name: { $regex: query, $options: "i" },
			_id: { $ne: req.user.id },
			hiddenAccount: { $ne: true },
			BlockedUser: { $ne: req.user.id }
		});

		res.status(200).json({
			searchResult: [ ...users ],
			success: true,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			message: "unable to search",
			success: false,
		});
	}
};
