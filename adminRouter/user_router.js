const express = require('express');
const router = express.Router();
const userController = require("../controller/userController")
const authMiddleware = require("../middleware/middleware/authMiddleware");

router.post("/login", userController.adminLogin);

module.exports = router;