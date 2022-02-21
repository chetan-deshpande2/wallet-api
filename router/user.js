import express from 'express'

// import authAdmin from '../middleware/authAdmin'

import userController from '../controller/userController'

const authRouter = express.Router()

authRouter.post('/register', userController.register)

authRouter.post('/email-activate', userController.activateEmail)
authRouter.post('/login', userController.login)

authRouter.get('/allinfo', userController.getAllUsersInfo)
authRouter.post('/updaterole', userController.updateUserRole)

export default authRouter
