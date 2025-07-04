const LoginOtp = require('../model/LoginOtp');
const { sendOtpEmail } = require('../utils/loginotp');

// Support multiple allowed emails, comma-separated in .env
const allowedEmails = (process.env.ALLOW_EMAIL || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

exports.requestOtp = async (req, res) => {
  const { email } = req.body;
  if (!email || !allowedEmails.includes(email.toLowerCase())) {
    return res
      .status(403)
      .json({ message: 'Login not allowed for this email.' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await LoginOtp.create({ email, otp });
  await sendOtpEmail(email, otp);
  res.json({ message: 'OTP sent to email.' });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !allowedEmails.includes(email.toLowerCase())) {
    return res
      .status(403)
      .json({ message: 'Login not allowed for this email.' });
  }
  const record = await LoginOtp.findOne({ email, otp });
  if (!record) {
    return res.status(400).json({ message: 'Invalid OTP.' });
  }
  await LoginOtp.deleteMany({ email });
  res.json({ message: 'OTP verified. Login successful.' });
};
