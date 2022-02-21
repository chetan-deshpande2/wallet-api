import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'

// //! router import

import authRouter from './router/user.js'
import { transactionRoute } from './router/transaction.js'
import notFound from './utils/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(express.json())

// !main routes

app.use('/api/v1', authRouter)
app.use('/api/v1', transactionRoute)
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3002
const url = process.env.MONGODB_URL

const start = async () => {
  try {
    await mongoose.connect(url)
    app.listen(port)
  } catch (error) {
    throw new Error("Couldn't connect")
  }
}
start()
