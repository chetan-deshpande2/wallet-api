import 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import bodyParser from 'body-parser'

import connectDB from './db/connectDb.js'

//! route import

import authRoutes from './router/user.js'
import transactionRoute from './router/transaction.js'
import notFound from './utils/notFound.js'

const app = express()

app.use(express.json())
app.use(cors())

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

// !main routes

app.use('/api/v1', authRoutes)
app.use('/api/v1', transactionRoute)
app.use(notFound)

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
