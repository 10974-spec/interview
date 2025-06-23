const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ****GENERATE JWT TOKEN****//

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ****REGISTER USER****//
// @desc Register new user
// @route POST /api/auth/register
// @access Public

const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl } = req.body;
    //****Check if user exists****//
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
    }
    //****HASH PASSWORD****/
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //****CREATE USER****//
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
    });
    //****return user data with jwt****/
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ****LOGIN USER****//
// @desc Login user
// @route POST/api/auth/login
// @access Public

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //****Check if user exists****//
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User does not exist" });
    }
    //****CHECK PASSWORD****//
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(500).json({ message: "Invalid password email or password" });
    }
    //****return user data with jwt****/
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ****GET USER PROFILE****//
// @desc Get user profile
// @route GET /api/auth/profile
// @access Private

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User does not exist" });
    }
    res.status(200).json(user);
      
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
