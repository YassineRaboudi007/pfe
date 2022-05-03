const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/AdminModel");
const Company = require("../models/CompanyModel");
const { sendEmail } = require("../helpers/sendEmail");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const admin = await Admin.findOne({ email });
  if (admin && (password, admin.password)) {
    res.json({
      _id: admin.id,
      username: admin.username,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.json({ err: "Invalid Credentials" });
  }
};

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

const deleteCompany = async (req, res) => {
  const { symbol } = req.body;
  const company = await Company.findOne({ symbol });
  if (!company) {
    res.json({ err: "Company Not Found" });
    return;
  }
  const res = await Company.deleteOne({ symbol });
  res.json({
    status: "Success",
  });
};

const getAllCompanys = async (req, res) => {
  const company = await Company.find();
  res.json({ company });
};

const getCompanyBySymbol = async (req, res) => {
  const company = await Company.findOne({ symbol });
  res.json({ company });
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  loginAdmin,
  addCompany,
  deleteCompany,
  getAllCompanys,
  getCompanyBySymbol,
};
