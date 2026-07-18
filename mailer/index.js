const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  tls: true,
  auth: {
    user: process.env.MAILER,
    pass: process.env.PASSWORD,
  },
});

module.exports = mailer;
