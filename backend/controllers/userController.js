import jwt from "jsonwebtoken";
import imageKit from "../config/imagekit.js";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2d" });
};

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const file = req.file;
    const uploadedImage = await imageKit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage: uploadedImage.url,
    });

    res.status(201).json({
      message: "Signup successful",
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found with this email" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(404).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        about: user.about,
        profileImage:user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Logout Function
export const logOut = async (req, res) => {
	try {
		// Clear the token cookie
		res.cookie("token", "", { maxAge: 0, httpOnly: true });
		return res.status(200).json({
			message: "User logged out successfully",
			success: true,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			message: "Logout failed",
			success: false,
		});
	}
};
