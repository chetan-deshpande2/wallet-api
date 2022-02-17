const User = require("../model/userModel");
const sendMail = require("../sendMail");

exports.transferFunds = async (req, res) => {
  try {
    let { amount, senderId, receiverId } = req.body;
    amount = Math.abs(Number(amount.trim()));
    console.log(req.body);
    const sender = senderId;
    const receiver = receiverId;
    console.log(receiver);
    //   const debitFromURL = `/Users/${sender}/withdrawFunds`;
    //   const transferToURL = `/Users/${receiver}/addFunds`;
    const senderAndReceiver = await User.find({
      $or: [{ accNo: sender }, { accNo: receiver }],
    });
    let [S, R] = senderAndReceiver;
    const senderName = S.accNo === sender ? S.name : R.name;
    const receiverName = R.accNo === receiver ? R.name : S.name;
    console.log(`Sent From ${senderName} to ${receiverName}`);
    const user = User.findOne({ accNo: sender });
    //   console.log(`Current Balance: ${response.currentBal}`);
    //   console.log(`Negated Amount: ${Number(-amount)}`);
    const currentBalance = user.currentBal + Number(-amount);
    if (currentBalance < 0) throw Error("Insufficient Funds!");
    console.log(`Balance: ${currentBalance}`);
    User.findOneAndUpdate(
      { accNo: sender },
      {
        $inc: { currentBal: Number(-amount) },
        $push: {
          transaction: {
            transactionType: "Debit",
            transactionDetails: {
              transferredFrom: "Self",
              transferredTo: receiverName,
              balance: currentBalance,
              amount: Number(amount),
            },
          },
        },
      }
    );
    addFund();
  } catch (error) {
    res.json({ message: error._message });
    console.log(error);
  }
};

const addFund = () => {
  User.findOne({ accNo: receiver }).then((response) => {
    console.log(`Before: ${response}`);
    const currentBalance = response.currentBal + amount;
    console.log(`Snapshot of Balance: ${currentBalance}`);
    User.findOneAndUpdate(
      { accNo: receiver },
      {
        $inc: { currentBal: amount },
        transaction: {
          transactionType: "Credit",
          transactionDetails: {
            transferredFrom: senderName,
            transferredTo: "Self",
            balance: currentBalance,
            amount: amount,
          },
        },
      }
    );
  });
};
