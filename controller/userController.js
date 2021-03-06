import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../model/userModel.js'

import { asyncWrapper } from '../utils/asyncWrapper.js'
import { createCustomError } from '../utils/appError.js'

import { sendMail } from '../utils/sendMail.js'

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACC_ACTIVATE, {
    expiresIn: '20m'
  })
}

const register = asyncWrapper(async (req, res, next) => {
  const { name, email, password, accNo } = req.body

  const user = await User.findOne({ email })
  //! check if user exists
  if (user) {
    return res.status(400).json({ msg: 'User Already Exits' })
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const newUser = {
    name,
    email,
    password: hashedPassword,
    accNo
  }

  const activateToken = createToken(newUser)

  const url = `${process.env.CLIENT_URL}/user/activate/${activateToken}`

  sendMail(user.email, url)

  res.status(200).json({ msg: 'Registeration Success !!Please activate email' })
})

const activateEmail = asyncWrapper(async (req, res, next) => {
  const { token } = req.body
  const user = jwt.verify(token, process.env.JWT_ACC_ACTIVATE)

  const { name, email, password, accNo } = user

  const check = await User.findOne({ email })
  if (check) {
    return res.status(400).json({ msg: 'User Already Exits' })
  }
  const newUser = new User({
    name,
    email,
    password,
    accNo
  })
  if (!newUser) {
    return next(createCustomError('Email Verification Failed', 404))
  }

  await newUser.save()

  res.status(200).json({ msg: 'Account activaed Sucessfully' })
})

const loginToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACC_LOGIN, {
    expiresIn: '7days'
  })
}

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return next(createCustomError('user not found', 404))
  }
  const emailMatch = await bcrypt.compare(password, user.password)

  if (!emailMatch) {
    return next(createCustomError('password does not match', 404))
  }

  const refreshToken = loginToken({ id: user._id })
  res.cookie('token ', refreshToken, {
    httpOnly: true,
    path: '/users/refreshToken',
    maxAge: 2 * 60 * 60 * 1000 // 2day
  })

  const userData = await getUserInfo(email)
  if (!userData) {
    return next(createCustomError('User not found', 404))
  }
  res.json(userData)
})

const getUserInfo = async (email) => {
  const user = await User.findOne(
    { email: email },
    'email currentBal transaction'
  )
  return user
}

const updateUserRole = asyncWrapper(async (req, res, next) => {
  const { role, id } = req.body
  const user = await User.findOneAndUpdate({ _id: id }, { role })
  if (!user) {
    return next(createCustomError('unable to update user', 404))
  }
  res.json({ msg: 'role updated' })
})

export { register, activateEmail, login, updateUserRole }
