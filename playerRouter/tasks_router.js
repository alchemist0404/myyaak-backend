const express = require('express');
const router = express.Router();
const TasksController = require("../controller/tasksController")
const authMiddleware = require("../middleware/middleware/authMiddleware");

router.post("/getTasks", authMiddleware.isLoggedIn, TasksController.getTasks);
router.post("/getPosition", authMiddleware.isLoggedIn, TasksController.getPosition);

module.exports = router;