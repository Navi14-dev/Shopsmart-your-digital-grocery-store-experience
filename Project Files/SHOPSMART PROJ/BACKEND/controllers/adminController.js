const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "PAID" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    // 👇 NEW (details)
   const users = await User.find()
  .select("name email role createdAt")
  .sort({ createdAt: -1 });

const products = await Product.find()
  .select("name price stock category createdAt")
  .sort({ createdAt: -1 });

const orders = await Order.find()
  .select("totalAmount paymentMethod paymentStatus orderStatus createdAt")
  .sort({ createdAt: -1 });


    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      users,
      products,
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.orderStatus = status;
  await order.save();

  res.json(order);
};

const ExcelJS = require("exceljs");

const exportOrdersExcel = async (req, res) => {
  const orders = await Order.find().populate("user");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Orders");

  sheet.columns = [
    { header: "Order ID", key: "_id" },
    { header: "User", key: "user" },
    { header: "Amount", key: "totalPrice" },
    { header: "Status", key: "orderStatus" },
    { header: "Date", key: "createdAt" }
  ];

  orders.forEach(o => {
    sheet.addRow({
      _id: o._id,
      user: o.user?.email,
      totalPrice: o.totalPrice,
      orderStatus: o.orderStatus,
      createdAt: o.createdAt
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  await workbook.xlsx.write(res);
  res.end();
};

const toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({
    message: user.isBlocked ? "User blocked" : "User unblocked",
    isBlocked: user.isBlocked
  });
};

module.exports={getDashboardStats,
    toggleBlockUser,
    getAllUsers,
    updateOrderStatus,
    exportOrdersExcel,
};
