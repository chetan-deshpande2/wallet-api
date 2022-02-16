const User = require("../model/userModel");

exports.addFund = async (req, res) => {
  // const id = req.params.id;
  let { amount, id } = req.body;
  amount = Math.abs(Number(amount.trim()));
  // console.log(req.body);

  User.findOne({ accNo: id })
    .then((response) => {
      // console.log(`Before: ${response}`);
      const snapshotOfCurrentBalance = response.currentBal + amount;
      // console.log(`Snapshot of Balance: ${snapshotOfCurrentBalance}`);
      User.findOneAndUpdate(
        { accNo: id },

        {
          $inc: { currentBal: amount },

          $push: {
            transactions: {
              transactionType: "credit",
              transactionDetails: {
                transferredFrom: "Self",
                transferredTo: "Self",
                balance: snapshotOfCurrentBalance,
                amount: amount,
              },
            },
          },
        }
      ).catch((err) => {
        res.json({ message: err._message });
        console.log(err);
      });
    })
    .catch((err) => {
      res.json({ message: err._message });
      console.log(err);
    });
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