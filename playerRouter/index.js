const express = require('express');
const router = express.Router();

const userRouter = require("./user_router")
const taskRouter = require("./tasks_router")
const paymentRouter = require("./payment_router")

router.use("/user", userRouter);
router.use("/tasks", taskRouter);
router.use("/payment", paymentRouter);

module.exports = router;