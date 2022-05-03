const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Company = require("../models/CompanyModel");
const Token = require("../models/TokenModel");
const { sendEmail } = require("../helpers/sendEmail");
const crypto = require("crypto");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const addCompany = async (req, res) => {
  const { name, symbol, website, password, email } = req.body;
  if (!name || !website || !password || !symbol || email) {
    res.status(400);
  }

  // Check if user exists
  const compnayBySymbol = await Company.findOne({ symbol });
  const compnayByName = await Company.findOne({ name });
  const compnayByEmail = await Company.findOne({ email });

  if (compnayByName || compnayBySymbol || compnayByEmail) {
    res.json({ err: "Non Unique Values" });
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const company = await Company.create({
    name,
    symbol,
    password: hashedPassword,
    email,
    website,
  });

  if (company) {
    res.status(201).json({
      token: generateToken(company._id),
    });
  } else {
    res.json({ err: "Some Error Occured" });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginCompany = async (req, res) => {
  const { name, password } = req.body;
  // Check for company mail
  const company = await Company.findOne({ name });

  if (company && (await bcrypt.compare(password, company.password))) {
    res.json({
      token: generateToken(company._id),
    });
  } else {
    res.json({ err: "Invalid Credentials" });
  }
};

const getAllCompanys = async (req, res) => {
  const companys = await Company.find();
  res.json({ companys });
};

const getCompanyById = async (req, res) => {
  const company = await Company.findById(req.params.id);
  res.json({ company });
};

const requestPasswordReset = async (req, res) => {
  const user = await Company.findOne({ email: req.body.email });
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

  const link = `http://localhost:3000/company/passwordReset?token=${resetToken}&id=${user._id}`;

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
  await Company.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  await passwordResetToken.deleteOne();
  return res.json({ status: "Success" });
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id, role: "company" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const updateCompany = async (req, res) => {
  const { id, password, symbol, website, name, email } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const queryRes = await Company.findOneAndUpdate(
    { _id: id },
    { password: hash, symbol, website, name, email }
  );
  if (queryRes) {
    res.json({ status: "Success" });
    return;
  }
  res.json({ err: "Some Error Occures" });
};

const getCompanyBySymbol = async (req, res) => {
  const company = await Company.findOne({ symbol });
  res.json({ company });
};

module.exports = {
  addCompany,
  loginCompany,
  getAllCompanys,
  getCompanyById,
  passwordReset,
  requestPasswordReset,
  updateCompany,
  getCompanyBySymbol,
};
