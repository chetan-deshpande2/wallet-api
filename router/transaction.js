import express from 'express'

import transactionController from '../controller/transactionController'

const router = express.Router()

router.post('/transferFunds', transactionController.transferFunds)

export default router
