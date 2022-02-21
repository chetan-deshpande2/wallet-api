import express from 'express'

import authAdmin from '../middleware/authAdmin'

import userController from '../controller/userController'

const router = express.Router()

router.post('/register', userController.register)

router.post('/email-activate', userController.activateEmail)
router.post('/login', userController.login)
// router.post("/info", userController.getUserInfo);
router.get('/allinfo', authAdmin, userController.getAllUsersInfo)
router.post('/updaterole', userController.updateUserRole)

export default router
