
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});


async function sendEmail(to, subject, templatePath, data) {
  try {
    const html = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: 'your_email@gmail.com',
      to: to,
      subject: subject,
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { sendEmail };
