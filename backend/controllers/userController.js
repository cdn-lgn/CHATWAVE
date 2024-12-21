import jwt from "jsonwebtoken";
import imageKit from "../config/imagekit.js";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";
import Group from "../models/groupSchema.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const file = req.file;
    const uploadedImage = await imageKit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: "chatwave/userProfile",
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

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Fetch groups created by the user
    const groupsCreatedByUser = await Group.find({ owner: user._id }).lean(); // Convert to plain objects

    // Generate token
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // Convert user to plain object
    const userObject = user.toObject();
    delete userObject.password;

    userObject.userCreatedGroups = groupsCreatedByUser;

    res.status(200).json({
      message: "Login successful",
      user: userObject,
    });
  } catch (error) {
    console.error("Error in Login Function:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const dataForUpdate = req.body;
    const userId = req.user.id;

    const file = req.file
    if(file){
      const uploadedImage = await imageKit.upload({
        file:file.buffer,
        fileName: `${Date.now()}-${file.originalname}`,
      folder: "chatwave/userProfile",
      })

      dataForUpdate.profileImage = uploadedImage.url
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: dataForUpdate },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "",
      success: false,
    });
  }
};


export const hideUser = async(req,res)=>{
try {
  const {hideUser} = req.body
  const userID = req.user.id
  const update = await User.findByIdAndUpdate(userID,{hiddenAccount:!hideUser},{new:true})
// console.log(hideUser)
    res.status(200).json({
      message: "success",
      success: true,
      hiddenAccount:update.hiddenAccount
    });
} catch (error) {
    console.log(error.message);
    res.status(500).json({
        message: "failed",
        success: false,
    });
}
}

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
