require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({ //create a transporter object
  service: 'gmail', //configure the email service
  auth: {
    user: process.env.EMAIL_USER || 'capsulestream520@gmail.com',
    pass: process.env.EMAIL_PASS || 'clbx rnkd usnz hlwd',
  },
});

module.exports = transporter;
