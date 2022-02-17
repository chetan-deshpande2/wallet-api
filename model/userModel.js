
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
    },

    transactionDetails: {
      transferredFrom: {
        type: String,
        default: "",
      },
      transferredTo: {
        type: String,
        default: "",
      },
      balance: {
        type: Number,
        default: 0,
      },

      amount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

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

    accNo: {
      type: String,
      required: true,
      default: mongoose.Types.ObjectId,
    },
    transaction: [transactionSchema],
    currentBal: {
      type: Number,
      default: 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);