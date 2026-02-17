const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");


/* =================================================
   PLACE ORDER FROM CART (FINAL FIX)
================================================= */
const placeOrderFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product?.name || "product"}`,
        });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      paymentStatus: "Paid",
      orderStatus: "PLACED",
    });

    // ✅ FINAL, GUARANTEED CART CLEAR
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


/* =================================================
   BUY NOW – SINGLE PRODUCT
================================================= */
const buyNow = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: "Product unavailable" });
    }

    const order = await Order.create({
      userId: req.user.id,
      items: [
        {
          productId: product._id,
          quantity,
          price: product.price,
        },
      ],
      totalAmount: product.price * quantity,
      orderStatus: "PLACED",
      paymentStatus: "Pending",
    });

    product.stock -= quantity;
    await product.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =================================================
   GET SINGLE ORDER (USER)
================================================= */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,   // VERY IMPORTANT
    }).populate("items.productId", "name price image");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




/* =================================================
   CHECKOUT (BUY NOW + CART)
================================================= */
const checkoutOrder = async (req, res) => {
  try {
    const {
      source,
      productId,
      quantity,
      customerDetails,
      paymentMethod = "COD",
      buyNowSource, // ✅ NEW
    } = req.body;

    // ✅ payment status logic
    const paymentStatus = paymentMethod === "COD" ? "PENDING" : "PAID";

    let items = [];
    let totalAmount = 0;

    /* ===============================
       BUY NOW FLOW
    =============================== */
    if (source === "buynow") {
      const product = await Product.findById(productId);

      if (!product || product.stock < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      items.push({
        productId: product._id,
        quantity,
        price: product.price,
      });

      totalAmount = product.price * quantity;

      // ✅ reduce stock
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -quantity },
      });

      // ✅ REMOVE ONLY THAT ITEM IF BUY NOW FROM CART
     if (buyNowSource === "CART") {
  await Cart.updateOne(
    { user: req.user.id },
    { $pull: { items: { product: productId } } }
  );
}


      // ❌ if buyNowSource === "PRODUCT" → cart untouched
    }

    /* ===============================
       FULL CART CHECKOUT FLOW
    =============================== */
    if (source === "cart") {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // 🔥 Remove invalid products automatically
  cart.items = cart.items.filter(item => item.product);
  await cart.save();

  if (cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for ${item.product.name}`,
      });
    }

    items.push({
      productId: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    });

    totalAmount += item.product.price * item.quantity;

    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  // ✅ Clear cart after successful processing
  await Cart.deleteOne({ user: req.user.id });
}


    /* ===============================
       CREATE ORDER
    =============================== */
    const order = await Order.create({
      userId: req.user.id,
      items,
      totalAmount,
      customerDetails,
      paymentMethod,
      paymentStatus,
      orderStatus: "PLACED",
    });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =================================================
   GET USER ORDERS
================================================= */
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id })
    .populate("items.productId", "name price image")
    .sort({ createdAt: -1 });

  res.json(orders);
};

/* =================================================
   ADMIN – GET ALL ORDERS
================================================= */
const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .populate("items.productId", "name price")
    .sort({ createdAt: -1 });

  res.json(orders);
};

/* =================================================
   ADMIN – UPDATE STATUS
================================================= */
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (req.body.orderStatus) order.orderStatus = req.body.orderStatus;
  if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;

  await order.save();
  res.json(order);
};

/* =================================================
   CANCEL ORDER
================================================= */
const cancelOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.user.id,
  }).populate("items.productId");

  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.orderStatus !== "PLACED") {
    return res.status(400).json({ message: "Cannot cancel this order" });
  }

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId._id, {
      $inc: { stock: item.quantity },
    });
  }

  order.orderStatus = "CANCELLED";
  await order.save();

  res.json({ message: "Order cancelled & stock restored" });
};

module.exports = {
  placeOrderFromCart,
  buyNow,
  checkoutOrder,
  getMyOrders,
  getOrderById, 
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  
};
