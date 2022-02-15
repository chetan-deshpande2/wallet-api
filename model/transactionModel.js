const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionType: { type: String },
    transactionDetails: {
      transaferredFrom: {
        type: String,
        default: "",
      },
      balance: { type: Number, default: 1000 },
      amount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
