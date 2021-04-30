const express = require('express');
const router = express.Router();
const TasksController = require("../controller/tasksController")
const authMiddleware = require("../middleware/middleware/authMiddleware");

router.post("/getTasks", authMiddleware.isLoggedIn, TasksController.getTasks);

module.exports = router;