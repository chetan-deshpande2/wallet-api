
const mongoose = require("mongoose");
const transactionSchema = require("./transactionModel");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: { type: Number, default: 0 }, //0 for user and 1 for admin
    transaction: [transactionSchema],
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);