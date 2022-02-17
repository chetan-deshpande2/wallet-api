const User = require("../model/userModel");
const sendMail = require("../sendMail");

exports.transferFunds = async (req, res) => {
  try {
    let { amount, senderId, receiverId } = req.body;
    amount = Math.abs(Number(amount.trim()));
    console.log(req.body);
    const sender = senderId;
    const receiver = receiverId;

    const senderAndReceiver = await User.find({
      $or: [{ accNo: sender }, { accNo: receiver }],
    });
    console.log(senderAndReceiver);
    let [S, R] = senderAndReceiver;
    const senderName = S.accNo === sender ? S.name : R.name;
    const receiverName = R.accNo === receiver ? R.name : S.name;

    const user = await User.findOne({ accNo: sender });

    const currentBalance = user.currentBal + Number(-amount);
    if (currentBalance < 0) throw Error("Insufficient Funds!");
    console.log(`Balance: ${currentBalance}`);
    await User.findOneAndUpdate(
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
    await addFund(receiver, amount, senderName);
    res.json({ msg: "fund transfer sucessfully" });
  } catch (error) {
    res.json({ message: error._message });
    console.log(error);
  }
};

const addFund = async (receiverId, amount, senderName) => {
  const receiver = receiverId;
  const user = await User.findOne({ accNo: receiver });
  console.log(`Before: ${user}`);
  const currentBalance = user.currentBal + amount;
  console.log(`Balance: ${currentBalance}`);
  await User.findOneAndUpdate(
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
};
