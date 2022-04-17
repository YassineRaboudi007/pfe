const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password, wallet } = req.body;

  if (!username || !email || !password || !wallet) {
    res.status(400);
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.json({ err: "User Already Exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    wallet,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      wallet: user.wallet,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      wallet: user.wallet,
      token: generateToken(user._id),
    });
  } else {
    res.json({ err: "Invalid Credentials" });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
