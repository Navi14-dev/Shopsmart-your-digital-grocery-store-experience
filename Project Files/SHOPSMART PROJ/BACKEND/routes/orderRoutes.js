const express = require("express");
const router = express.Router();
const { downloadInvoice } = require("../controllers/invoiceController");
const {
  placeOrderFromCart,
  buyNow,
  checkoutOrder,
  getMyOrders,
  getOrderById, 
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// USER
router.post("/cart", authMiddleware, placeOrderFromCart);
router.post("/buynow", authMiddleware, buyNow);
router.post("/checkout", authMiddleware, checkoutOrder);
router.get("/myorders", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/cancel", authMiddleware, cancelOrder);
router.get("/:id/invoice", authMiddleware, downloadInvoice);


// ADMIN
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:id", authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
