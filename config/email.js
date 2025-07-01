require('dotenv').config();
const nodemailer = require('nodemailer');
const { secret } = require('./secret');

// sendEmail
module.exports.sendEmail = async (body, res, message) => {
  const transporter = nodemailer.createTransport({
    host: secret.email_host,
    service: secret.email_service, //comment this line if you use custom server/domain
    port: secret.email_port,
    secure: true,
    auth: {
      user: secret.email_user,
      pass: secret.email_pass,
    },
  });

  transporter.verify(function (err, success) {
    if (err) {
      res.status(403).send({
        message: `Error happen when verify ${err.message}`,
      });
      return; // Stop if verification fails
    }
    // Only send mail if verify succeeds
    const sendEmail = async (mailData, res, message) => {
      try {
        await transporter.sendMail(mailData);
        res.status(200).send({ message });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    };

    sendEmail(body, res, message);
  });
};
