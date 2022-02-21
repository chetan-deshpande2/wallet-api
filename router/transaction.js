import express from 'express'

import { funds } from '../controller/transactionController.js'

const router = express.Router()

router.post('/transferFunds', funds)

export { router as transactionRoute }
