import User from '../model/userModel.js'

import { transactionSuccessMail } from '../utils/transactionEmail.js'
import { asyncWrapper } from '../utils/asyncWrapper.js'
import { createCustomError } from '../utils/appError.js'

const transferFunds = asyncWrapper(async (req, res, next) => {
  let { amount, senderId, receiverId } = req.body
  amount = Math.abs(Number(amount.trim()))

  const senderAndReceiver = await User.find({
    $or: [{ accNo: senderId }, { accNo: receiverId }]
  })

  const [S, R] = senderAndReceiver
  const senderName = S.accNo === senderId ? S.name : R.name
  const receiverName = R.accNo === receiverId ? R.name : S.name
  const user = await User.findOne({ accNo: senderId })
  if (!user) {
    return next(createCustomError('User not found', 404))
  }
  const currentBalance = user.currentBal + Number(-amount)
  if (currentBalance < 0) throw Error('Insufficient Funds!')
  const updateUser = await User.findOneAndUpdate(
    { accNo: senderId },
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
  await addFund(receiverId, amount, senderName)
  transactionSuccessMail(user.email)
  res.json({ msg: 'fund transfer sucessfully' })
})

const addFund = async (receiver, amount, senderName) => {
  const user = await User.findOne({ accNo: receiver })
  if (!user) {
    return next(createCustomError('user not found', 404))
  }
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

const trasactionDetails = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  if (user.role === 1) {
    const alllTrx = await trasactionDetails.find()
    res.status(200).json({ status: `welcome admin`, result: alllTrx })
  } else {
    return next(createCustomError('unable to update user', 404))
  }
})

const getAllUsersInfo = asyncWrapper(async (req, res, next) => {
  const users = await User.find(req.user, 'email transaction')
  res.json(users)
  if (!users) {
    return next(createCustomError('unable to update user', 404))
  }
})

export { transferFunds as funds, trasactionDetails as Details }
