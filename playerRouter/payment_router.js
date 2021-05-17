const express = require('express');
const router = express.Router();
const PaymentController = require("../controller/paymentController")
const authMiddleware = require("../middleware/middleware/authMiddleware");

router.post("/depositWithPaypal", authMiddleware.isLoggedIn, PaymentController.depositWithPaypal);
router.post("/paymentUpdate", authMiddleware.isLoggedIn, PaymentController.paymentUpdate);

module.exports = router;