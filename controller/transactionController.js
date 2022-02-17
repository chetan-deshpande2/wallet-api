const User = require("../model/userModel");

exports.addFund = async (req, res) => {
  // const id = req.params.id;
  // let { amount, id } = req.body;
  // amount = Math.abs(Number(amount.trim()));
  // // console.log(req.body);
  let amount = 23;
  User.findOne({ accNo: "620db26c493beeed1f26796e" })
    .then((response) => {
      // console.log(`Before: ${response}`);
      const snapshotOfCurrentBalance = response.currentBal + amount;
      // console.log(`Snapshot of Balance: ${snapshotOfCurrentBalance}`);
      User.findOneAndUpdate(
        { accNo: "620db26c493beeed1f26796e" },

        {
          $inc: { currentBal: amount },

          $push: {
            transaction: {
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

// const transferFunds = async (req, res) => {
//   try {
//     // let { amount } = req.body;
//     // amount = Math.abs(Number(amount.trim()));
//     let amount = 50;
//     console.log(req.body);
//     const sender = "620db26c493beeed1f26796e";
//     const receiver = "620db48e56d29c70994fb70b";
//     const debitFromURL = `/Users/${sender}/withdrawFunds`;
//     const transferToURL = `/Users/${receiver}/addFunds`;
  
//     User.find({ $or: [{ accNo: sender }, { accNo: receiver }] })
//       .then((senderAndReceiver) => {
//         let [S, R] = senderAndReceiver;
//         const senderName = S.accNo === sender ? S.name : R.name;
//         const receiverName = R.accNo === receiver ? R.name : S.name;
//         console.log(`Sent From ${senderName} to ${receiverName}`);
//         //Withdraw Funds
  
//         User.findOne({ accNo: sender })
//           .then((response) => {
//             // console.log(`Current Balance: ${response.currentBal}`);
//             // console.log(`Negated Amount: ${Number(-amount)}`);
//             const snapshotOfCurrentBalance =
//               response.currentBal + Number(-amount);
//             if (snapshotOfCurrentBalance < 0) throw Error("Insufficient Funds!");
//             // console.log(`Snapshot of Balance: ${snapshotOfCurrentBalance}`);
//             User.findOneAndUpdate(
//               { accNo: sender },
  
//               {
//                 $inc: { currentBal: Number(-amount) },
  
//                 $push: {
//                   transactions: {
//                     transactionType: "debit",
//                     transactionDetails: {
//                       transferredFrom: "Self",
//                       transferredTo: receiverName,
//                       balance: snapshotOfCurrentBalance,
//                       amount: Number(amount),
//                     },
//                   },
//                 },
//               }
//             )
//               .then((response) => {
//                 addFunds();
//               })
//               .catch((err) => {
//                 res.send(`error`);
//               });
//           })
//           .catch((err) => {
//             res.send(`error`);
//           });
    

const getAccountNumbers = () => {
  User.find({ $: [{ accNo: sender }, { accNo: receiver }] });
};
const getCurrentAmountById = async ({ accNo: sender }) => {
  return User.findOne(sender);
}

// module.exports = { addFund, transferFunds }
