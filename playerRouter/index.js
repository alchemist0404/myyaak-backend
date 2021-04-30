const express = require('express');
const router = express.Router();

const userRouter = require("./user_router")
const taskRouter = require("./tasks_router")

router.use("/user", userRouter);
router.use("/tasks", taskRouter);

module.exports = router;