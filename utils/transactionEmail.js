import mailgun from 'mailgun-js'
import 'dotenv/config'
import { Details } from '../controller/transactionController.js'

const transactionSuccessMail = (email) => {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  })

  const sendFrom = 'noreply@demo.com'
  const userEmail = email

  const htmlCode = `Transaction Successful ${Details}`

  const mailOptions = {
    from: sendFrom,
    to: userEmail,
    subject: 'Transaction Details',
    html: htmlCode
  }

  mg.messages().send(mailOptions, function (error, body) {
    if (error) {
      return
    }
    console.log(body)
  })
}

export { transactionSuccessMail }
