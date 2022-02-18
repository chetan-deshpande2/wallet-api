const nodemailer = require('nodemailer')

const mailgun = require('mailgun-js')

exports.sendMail = (email, url) => {
  console.log(email)
  const auth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    }
  }
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  })

  //   let transporter = nodemailer.createTestAccount(nodeMailgun(auth));
  const sendFrom = 'noreply@demo.com'
  let userEmail = email
  const confirmUrl = url
  htmlCode = ` <html>
  <body>
  <p>Please verify your email address:</p> <b> ${confirmUrl} </b>

  </body>
  </html>`
  console.log(userEmail)
  const mailOptions = {
    from: sendFrom,
    to: userEmail,
    subject: 'email verification',
    html: htmlCode
  }

  mg.messages().send(mailOptions, function (error, body) {
    console.log(body)
  })
  //   transporter.sendMail(mailOptions, (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("msg send");
  //     }
  //   });
}

exports.transactionSuccessMail = (email) => {
  const auth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    }
  }
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  })

  const sendFrom = 'noreply@demo.com'
  let userEmail = email

  let htmlCode = `Transaction Successful`

  const mailOptions = {
    from: sendFrom,
    to: userEmail,
    subject: 'Transaction Details',
    html: htmlCode
  }

  mg.messages().send(mailOptions, function (error, body) {
    console.log(body)
  })
}

exports.transactionFailedMail = (email) => {
  const auth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    }
  }
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  })

  const sendFrom = 'noreply@demo.com'
  let userEmail = email

  let htmlCode = `Transaction Failed`

  const mailOptions = {
    from: sendFrom,
    to: userEmail,
    subject: 'Transaction Details',
    html: htmlCode
  }

  mg.messages().send(mailOptions, function (error, body) {
    console.log(body)
  })
}
