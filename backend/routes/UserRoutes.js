const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  requestPasswordReset,
  passwordReset,
  getUserById,
  updateUser,
} = require("../controller/UserController");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/resetPasswordRequest", requestPasswordReset);
router.post("/passwordReset", passwordReset);
router.post("/:id", getUserById);
router.put("/update", updateUser);
module.exports = router;
