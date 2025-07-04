const express = require('express');
const router = express.Router();
const loginOtpController = require('../controller/loginotp.controller');

router.post('/request', loginOtpController.requestOtp);
router.post('/verify', loginOtpController.verifyOtp);
router.post('/logout', loginOtpController.logout);

module.exports = router;
