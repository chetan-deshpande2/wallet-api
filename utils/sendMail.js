import mailgun from 'mailgun-js'

const sendMail = (email, url) => {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  })

  const sendFrom = 'noreply@demo.com'
  const userEmail = email
  const confirmUrl = url
  const htmlCode = ` <html>
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
    if (error) {
      return
    }
    console.log(body)
  })
}

export { sendMail }
