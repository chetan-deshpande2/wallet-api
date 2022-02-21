import express from 'express'

import transactionController from '../controller/transactionController'

const transactionRoute = express.Router()

transactionRoute.post('/transferFunds', transactionController.transferFunds)

export default transactionRoute
