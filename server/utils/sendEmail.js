const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER, // e.g., 'your.email@gmail.com'
        pass: process.env.EMAIL_PASS  // Your 16-letter App Password
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: text 
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.log("Email failed to send.", error);
  }
};

module.exports = sendEmail;