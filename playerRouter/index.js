const express = require('express');
const router = express.Router();

const DashboardRouter = require("./dashboard_router");
const userRouter = require("./user_router")

router.use("/dashboard",DashboardRouter);
router.use("/user",userRouter);

module.exports = router;