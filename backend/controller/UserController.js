const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Token = require("../models/TokenModel");
const { sendEmail } = require("../helpers/sendEmail");
const crypto = require("crypto");

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
    return;
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

const requestPasswordReset = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.json({ err: "Email doesnt correspand to user account" });
    return;
  }
  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();
  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 12);

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `http://localhost:3000/user/passwordReset?token=${resetToken}&id=${user._id}`;

  if (sendEmail(user.email, "Password Reset Request", link)) {
    res.json({
      status: "Success",
    });
    console.log("email sent");
  } else {
    console.log("nooo");
    res.json({ err: "Error Sending Email" });
  }
};

const passwordReset = async (req, res) => {
  const { userId, token, password } = req.body;

  let passwordResetToken = await Token.findOne({ userId: req.body.userId });
  if (!passwordResetToken) {
    res.json({ err: "Invalid or expired password reset token" });
    return;
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    res.json({ err: "Invalid or expired password reset token" });
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  await passwordResetToken.deleteOne();
  return res.json({ status: "Success" });
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
  requestPasswordReset,
  passwordReset,
};
