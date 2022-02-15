const User = require("../model/userModel");

exports.addFund = async (req, res) => {
  try {
    const id = req.params.id;
    let { amount, email } = req.body;
    amount = Math.abs(Number(amount.trim()));
    console.log(amount);

    const { currentBalance } = await getCurrentAmountByEmail(email);

    let currentBalanceHolder = currentBalance + amount;
    Customer.findOneAndUpdate(
      { accNo: id },

      {
        $inc: { currentBal: amount },

        $push: {
          transactions: {
            transactionType: "credit",
            transactionDetails: {
              transferredFrom: "Self",
              transferredTo: "Self",
              balance: currentBalanceHolder,
              amount: amount,
            },
          },
        },
      }
    );

    res.json({ msg: currentBalance });
  } catch (error) {
    res.status(404).json({ error: err.message });
  }
};

const getCurrentAmountByEmail = async (email) => {
  return User.findOne(email);
};

exports.transferFunds = async (req, res) => {
  try {
    let { amount } = req.body;
    amount = Math.abs(Number(amount.trim()));
    console.log(req.body);
    const sender = req.params.id;
    const receiver = req.body.transferTo;
    const debitFromURL = `/customers/${sender}/withdrawFunds`;
    const transferToURL = `/customers/${receiver}/addFunds`;
    let user = getCurrentAmountById(accNo);
    const currentBal = user.currentBalance + Number(-amount);
    if (currentBal < 0) {
      throw Error("Insufficent Funds");
    }
    User.findOneAndUpdate(
      { accNo: sender },

      {
        $inc: { currentBal: Number(-amount) },

        $push: {
          transactions: {
            transactionType: "debit",
            transactionDetails: {
              transferredFrom: "Self",
              transferredTo: receiverName,
              balance: snapshotOfCurrentBalance,
              amount: Number(amount),
            },
          },
        },
      }
    );
    this.addFund();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getAccountNumbers = () => {
  User.find({ $: [{ accNo: sender }, { accNo: receiver }] });
};
const getCurrentAmountById = async ({ accNo: sender }) => {
  return User.findOne(sender);
};