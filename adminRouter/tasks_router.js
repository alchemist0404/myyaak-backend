const path = require('path');
const multer = require('multer');
const express = require('express');
const { BASEURL } = require('../db');
const router = express.Router();
const TasksController = require("../controller/tasksController")
const authMiddleware = require("../middleware/middleware/authMiddleware");
const ImageUploader = require("../middleware/middleware/Uploader");

var Uploader = new ImageUploader(path.join(BASEURL))
router.post("/getTasks", TasksController.getTasks);
router.post("/add", multer({ storage: Uploader.storage, fileFilter: Uploader.filter }).any(), TasksController.add);
router.post("/deleteTask", TasksController.deleteTask);

module.exports = router;