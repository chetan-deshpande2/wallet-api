const User = require('../model/userModel')
const { transactionFailedMail, transactionSuccessMail } = require('../sendMail')

exports.addFundstoSelf = async (req, res) => {
  try {
    let { amount, id } = req.body
    amount = Math.abs(Number(amount.trim()))

    const user = await User.findOne({ accNo: id })

    const currentBalance = user.currentBal + amount

    await User.findOneAndUpdate(
      { accNo: id },

      {
        $inc: { currentBal: amount },

        $push: {
          transaction: {
            transactionType: 'credit',
            transactionDetails: {
              transferredFrom: 'Self',
              transferredTo: 'Self',
              balance: currentBalance,
              amount: amount
            }
          }
        }
      }
    )

    transactionSuccessMail(user.email)
    res.status(200).json({ msg: user.email })
  } catch (error) {
    res.json({ msg: error.message })
  }
}

exports.transferFunds = async (req, res) => {
  try {
    let { amount, senderId, receiverId } = req.body
    amount = Math.abs(Number(amount.trim()))
    console.log(req.body)
    const sender = senderId
    const receiver = receiverId

    const senderAndReceiver = await User.find({
      $or: [{ accNo: sender }, { accNo: receiver }]
    })
    console.log(senderAndReceiver)
    const [S, R] = senderAndReceiver
    const senderName = S.accNo === sender ? S.name : R.name
    const receiverName = R.accNo === receiver ? R.name : S.name

    const user = await User.findOne({ accNo: sender })

    const currentBalance = user.currentBal + Number(-amount)
    if (currentBalance < 0) throw Error('Insufficient Funds!')
    console.log(`Balance: ${currentBalance}`)
    await User.findOneAndUpdate(
      { accNo: sender },
      {
        $inc: { currentBal: Number(-amount) },
        $push: {
          transaction: {
            transactionType: 'Debit',
            transactionDetails: {
              transferredFrom: 'Self',
              transferredTo: receiverName,
              balance: currentBalance,
              amount: Number(amount)
            }
          }
        }
      }
    )
    await addFund(receiver, amount, senderName)
    transactionSuccessMail(user.email)
    await res.json({ msg: 'fund transfer sucessfully' })
  } catch (error) {
    res.json({ msg: error.message })
    console.log(error)
  }
}

const addFund = async (receiver, amount, senderName) => {
  const user = await User.findOne({ accNo: receiver })
  const currentBalance = user.currentBal + amount
  await User.findOneAndUpdate(
    { accNo: receiver },
    {
      $inc: { currentBal: amount },
      $push: {
        transaction: {
          transactionType: 'Credit',
          transactionDetails: {
            transferredFrom: senderName,
            transferredTo: 'Self',
            balance: currentBalance,
            amount: amount
          }
        }
      }
    }
  )
  transactionSuccessMail(user.email)
}
