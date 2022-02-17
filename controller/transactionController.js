const User = require("../model/userModel");
const { transactionSuccessMail } = require("../sendMail");

exports.addFund = async (req, res) => {
  try {
    //  const id = req.params.id;
    //  console.log(id);
    let { amount, id } = req.body;
    amount = Math.abs(Number(amount.trim()));
    console.log(req.body);

    const user = await User.findOne({ accNo: id });
    console.log(`Before: ${user.currentBal}`);
    const currentBalance = user.currentBal + amount;
    console.log(`Balance: ${currentBalance}`);
    await User.findOneAndUpdate(
      { accNo: id },

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

    // transactionSuccessMail(user.email);
    res.status(200).json({ msg: user.email });
  } catch (err) {
    res.json({ message: err._message });
  }
};


