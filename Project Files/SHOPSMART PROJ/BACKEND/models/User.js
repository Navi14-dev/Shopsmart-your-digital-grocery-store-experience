const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isAdmin: { type: Boolean, default: false },
    isBlocked: {
  type: Boolean,
  default: false
},
    resetToken: String,
resetTokenExpiry: Date,

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
