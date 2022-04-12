const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Company = require("../models/CompanyModel");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const addCompany = async (req, res) => {
  const {name, symbol, website, password} = req.body;
  if (!name || !website || !password || !symbol) {
    res.status(400);
  }

  // Check if user exists
  const compnayBySymbol = await Company.findOne({symbol});
  const compnayByName = await Company.findOne({name});

  if (compnayByName || compnayBySymbol) {
    res.status(400);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const company = await Company.create({
    name,
    symbol,
    password: hashedPassword,
    website,
  });

  if (company) {
    res.status(201).json({
      token: generateToken(company._id),
    });
  } else {
    res.status(400);
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginCompany = async (req, res) => {
  const {name, password} = req.body;
  console.log("name and pwd ", name, password);
  // Check for company mail
  const company = await Company.findOne({name});
  const companys = await Company.find();

  if (company && (await bcrypt.compare(password, company.password))) {
    res.json({
      token: generateToken(company._id),
    });
  } else {
    res.status(400);
  }
};

const getAllCompanys = async (req, res) => {
  const companys = await Company.find();
  res.json({companys});
};

const getCompanyById = async (req, res) => {
  const company = await Company.findById(req.params.id);
  res.json({company});
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({id, role: "company"}, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  addCompany,
  loginCompany,
  getAllCompanys,
  getCompanyById,
};
