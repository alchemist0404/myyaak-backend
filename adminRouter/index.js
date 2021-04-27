const express = require('express');
const router = express.Router();

const userRouter = require("./user_router")
const tasksRouter = require("./tasks_router")

router.use("/user",userRouter);
router.use("/tasks",tasksRouter);

module.exports = router;