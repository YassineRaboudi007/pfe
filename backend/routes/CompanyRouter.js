const express = require("express");
const router = express.Router();
const {
  addCompany,
  loginCompany,
  getAllCompanys,
  getCompanyById,
  requestPasswordReset,
  passwordReset,
} = require("../controller/CompanyController");

router.post("/signup", addCompany);
router.post("/login", loginCompany);
router.post("/resetPasswordRequest", requestPasswordReset);
router.post("/passwordReset", passwordReset);
router.post("/:id", getCompanyById);
router.get("/", getAllCompanys);
module.exports = router;
