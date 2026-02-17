const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    gateway: {
      type: String,
      default: "RAZORPAY",
    },
    paymentId: String,
    signature: String,
    amount: Number,
    status: {
      type: String,
      enum: ["CREATED", "SUCCESS", "FAILED"],
      default: "CREATED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
