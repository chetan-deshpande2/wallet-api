const User = require("../model/userModel");
const { transactionSuccessMail } = require("../sendMail");

exports.addFund = async (req, res) => {
  try {
    //  const id = req.params.id;
    //  console.log(id);
    let { amount } = req.body;
    amount = Math.abs(Number(amount.trim()));
    console.log(req.body);

    const user = await User.findOne({ accNo: "620db48e56d29c70994fb70b" });
    console.log(`Before: ${user}`);
    const currentBalance = user.currentBal + amount;
    console.log(`Balance: ${currentBalance}`);
    User.findOneAndUpdate(
      { accNo: "620db48e56d29c70994fb70b" },

      {
        $inc: { currentBal: amount },

        $push: {
          transaction: {
            transactionType: "credit",
            transactionDetails: {
              transferredFrom: "Self",
              transferredTo: "Self",
              balance: currentBalance,
              amount: amount,
            },
          },
        },
      }
    );

    transactionSuccessMail(user.email);
    res.status(200).json({ msg: "success" });
  } catch (err) {
    res.json({ message: err._message });
  }
};


