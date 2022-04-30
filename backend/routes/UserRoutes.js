const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  requestPasswordReset,
  passwordReset,
} = require("../controller/UserController");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/resetPasswordRequest", requestPasswordReset);
router.post("/passwordReset", passwordReset);
module.exports = router;
