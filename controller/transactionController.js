import User from '../model/userModel'

import transactionSuccessMail from '../utils/transactionEmail'
import asyncWrapper from '../utils/asyncWrapper'
import { createCustomError, CustomAPIError } from '../utils/appError'

const transferFunds = asyncWrapper(async (req, res, next) => {
  let { amount, senderId, receiverId } = req.body
  amount = Math.abs(Number(amount.trim()))

  const sender = senderId
  const receiver = receiverId

  const senderAndReceiver = await User.find({
    $or: [{ accNo: sender }, { accNo: receiver }]
  })

  const [S, R] = senderAndReceiver
  const senderName = S.accNo === sender ? S.name : R.name
  const receiverName = R.accNo === receiver ? R.name : S.name

  const user = await User.findOne({ accNo: sender })
  if (!user) {
    return next(createCustomError('User not found', 404))
  }

  const currentBalance = user.currentBal + Number(-amount)
  if (currentBalance < 0) throw Error('Insufficient Funds!')

  const updateUser = await User.findOneAndUpdate(
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
  if (!updateUser) {
    return next(createCustomError('unable to update user', 404))
  }
  await addFund(receiver, amount, senderName)
  transactionSuccessMail(user.email)
  res.json({ msg: 'fund transfer sucessfully' })
})

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

export default transferFunds
