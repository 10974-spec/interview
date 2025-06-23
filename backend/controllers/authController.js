const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ****GENERATE JWT TOKEN****//

const generateToken = (id) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ****REGISTER USER****//
// @desc Register new user
// @route POST /api/auth/register
// @access Public

const registerUser = async (req, res) => {
   
};

// ****LOGIN USER****//
// @desc Login user
// @route POST/api/auth/login
// @access Public


const loginUser = async (req, res) => {
   
};

// ****GET USER PROFILE****//
// @desc Get user profile
// @route GET /api/auth/profile
// @access Private

const getUserProfile = async (req, res) => {

}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
}