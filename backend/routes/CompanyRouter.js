const express = require("express");
const router = express.Router();
const {
  addCompany,
  loginCompany,
  getAllCompanys,
} = require("../controller/CompanyController");

router.post("/signup", addCompany);
router.post("/login", loginCompany);
router.get("/", getAllCompanys);

module.exports = router;
