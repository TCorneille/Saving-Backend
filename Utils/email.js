const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  if (!options.email || !options.subject || !options.message) {
    throw new Error('Missing required email fields (email, subject, message)');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for others
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'Paul Ntakirutimana <paul@cor.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || undefined
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
