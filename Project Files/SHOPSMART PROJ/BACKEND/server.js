require("dotenv").config();   // MUST be first

const express = require("express");
// const mongoose = require('mongoose');
const cors = require("cors");
const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");cm
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


const adminRoutes = require("./routes/adminRoutes");




const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments",paymentRoutes);

app.use("/api/admin", adminRoutes);







// Database connection
connectDB();

// const bcrypt = require("bcryptjs");

// bcrypt.hash("admin123", 10).then(hash => {
//   console.log(hash);
// });



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});






















// -----------------------------------------------
const mongoose = require("mongoose");

app.get("/test-db", async (req, res) => {
  try {
    const Test = mongoose.connection.collection("test");
    await Test.insertOne({ message: "ShopSmart DB created", time: new Date() });
    res.send("Inserted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});




