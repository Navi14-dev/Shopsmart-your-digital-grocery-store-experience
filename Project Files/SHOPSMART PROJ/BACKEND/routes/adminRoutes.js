const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { toggleBlockUser } = require("../controllers/adminController");
const {getAllUsers} = require("../controllers/adminController");
const {updateOrderStatus} = require("../controllers/adminController");
const {exportOrdersExcel} = require("../controllers/adminController");


// 🔐 Admin Dashboard Stats
router.get(
  "/dashboard-stats",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);
router.patch(
  "/users/:id/block",
  authMiddleware,
  adminMiddleware,
  toggleBlockUser
);
router.patch(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

router.get(
  "/orders/export/excel",
  authMiddleware,
  adminMiddleware,
  exportOrdersExcel
);

router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);


module.exports = router;
