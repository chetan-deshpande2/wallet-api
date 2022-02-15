const nodemailer = require("nodemailer");
const nodeMailgun = require("nodemailer-mailgun-transport");
const mailgun = require("mailgun-js");

const sendMail = (email, url) => {
  //   console.log(email);
  const auth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  };
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

  //   let transporter = nodemailer.createTestAccount(nodeMailgun(auth));
  const sendFrom = "noreply@demo.com";
  let userEmail = email;
  const confirmUrl = url;

  const mailOptions = {
    from: sendFrom,
    to: userEmail,
    subject: "Hello",
    html: `${confirmUrl}`,
  };

  mg.messages().send(mailOptions, function (error, body) {
    console.log(body);
  });
  //   transporter.sendMail(mailOptions, (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("msg send");
  //     }
  //   });
};

const transactionMail = () => {
  const auth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  };
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

  //   let transporter = nodemailer.createTestAccount(nodeMailgun(auth));
  const sendFrom = "noreply@demo.com";
  let userEmail = email;
  const confirmUrl = url;

  const mailOptions = {
    from: sendFrom,
    to: userEmail,
    subject: "Transaction Details",
    html: ``,
  };

  mg.messages().send(mailOptions, function (error, body) {
    console.log(body);
  });
};

module.exports = { sendMail };
