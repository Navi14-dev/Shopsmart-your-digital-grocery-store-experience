const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/create", authMiddleware, createPaymentOrder);
router.post("/verify", authMiddleware, verifyPayment);

module.exports = router;
