const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * Public Routes
 */
router.get("/", authMiddleware, getAllProducts);
router.get("/:id",authMiddleware, getProductById);

/**
 * Admin Routes
 */

router.post("/add", authMiddleware, adminMiddleware, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
