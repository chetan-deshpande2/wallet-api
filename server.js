import 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import bodyParser from 'body-parser'

import connectDB from './db/connectDb.js'

//! route import

import authRouter from './router/user.js'
import transactionRoute from './router/transaction.js'
import notFound from './utils/notFound.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

app.use(express.json())
app.use(cors())

app.use(cookieParser())

// !main routes

app.use('/api/v1', authRouter)
app.use('/api/v1', transactionRoute)
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3002

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL)
    app.listen(port)
  } catch (error) {
    throw new Error("Couldn't connect")
  }
}

start()
