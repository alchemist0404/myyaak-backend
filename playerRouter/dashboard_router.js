const express = require('express');
const router = express.Router();
const DashboardControl = require("../controller/dashboardController")
const authMiddleware = require("../middleware/middleware/authMiddleware");

router.post("/getUserLoad", authMiddleware.isLoggedIn, DashboardControl.getUserLoad);

module.exports = router;