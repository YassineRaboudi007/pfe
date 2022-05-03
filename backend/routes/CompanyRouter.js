const express = require("express");
const router = express.Router();
const {
  addCompany,
  loginCompany,
  getAllCompanys,
  getCompanyById,
  requestPasswordReset,
  passwordReset,
  updateCompany,
} = require("../controller/CompanyController");

router.post("/signup", addCompany);
router.post("/login", loginCompany);
router.post("/resetPasswordRequest", requestPasswordReset);
router.post("/passwordReset", passwordReset);
router.post("/:id", getCompanyById);
router.put("/update", updateCompany);
router.get("/", getAllCompanys);

module.exports = router;
