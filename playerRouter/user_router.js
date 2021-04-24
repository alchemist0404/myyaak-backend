const express = require('express');
const router = express.Router();
const userController = require("../controller/userController")
const authMiddleware = require("../middleware/middleware/authMiddleware");

router.post("/login", userController.login);
router.post("/getUserData", authMiddleware.isLoggedIn, userController.getUserData);

module.exports = router;