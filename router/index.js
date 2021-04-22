const express = require('express');
const router = express.Router();

const DashboardRouter = require("./dashboard_router");

router.use("/dashboard",DashboardRouter);
module.exports = router;