require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')

const connectDB = require('./db/connectDb')

// route import
const authRoutes = require('./router/user')
const transactionRoute = require('./router/transaction')

const app = express()

app.use(express.json())
app.use(cors())

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

// main routes

app.use('/api/v1', authRoutes)
app.use('/api/v1', transactionRoute)

const port = process.env.PORT || 3002

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL)
    app.listen(port, () => {
      console.log('server is listening')
    })
  } catch (error) {
    throw new Error("Couldn't connect")
  }
}

start()
