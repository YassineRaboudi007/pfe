const express = require("express");
const router = express.Router();
const {
  addCompany,
  loginCompany,
  getAllCompanys,
  getCompanyById,
} = require("../controller/CompanyController");

router.post("/signup", addCompany);
router.post("/login", loginCompany);
router.get("/", getAllCompanys);
router.post("/:id", getCompanyById);
module.exports = router;
