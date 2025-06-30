require('dotenv').config();
const nodemailer = require('nodemailer');
const { secret } = require('./secret');

// sendEmail
module.exports.sendEmail = (body, res, message) => {
  return new Promise((resolve, reject) => {
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
        if (res) {
          return res.status(403).send({
            message: `Error happen when verify ${err.message}`,
          });
        }
        return reject(new Error(`Error happen when verify ${err.message}`));
      }
    });

    transporter.sendMail(body, (err, data) => {
      if (err) {
        if (res) {
          return res.status(403).send({
            message: `Error happen when sending email ${err.message}`,
          });
        }
        return reject(
          new Error(`Error happen when sending email ${err.message}`),
        );
      } else {
        if (res) {
          return res.send({
            message: message,
          });
        }
        return resolve(data);
      }
    });
  });
};
