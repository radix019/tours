const nodemailer = require('nodemailer');

const sendEamil = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'Rahul Singh <rahul@me.com>',
    to: options.email,
    subject: options.subject,
    html: `<h2>${options.message}</h2>`,
  };
  await transport.sendMail(mailOptions);
};
module.exports = sendEamil;
