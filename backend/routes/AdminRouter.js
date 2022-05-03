const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controller/AdminController");

router.post("/login", loginAdmin);

module.exports = router;
