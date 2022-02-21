import express from 'express'

// import authAdmin from '../middleware/authAdmin'

import {
  register,
  activateEmail,
  login,
  updateUserRole
} from '../controller/userController.js'

const authRouter = express.Router()

authRouter.post('/register', register)

authRouter.post('/email-activate', activateEmail)
authRouter.post('/login', login)

// authRouter.post('/updaterole', userController.updateUserRole)

export default authRouter
