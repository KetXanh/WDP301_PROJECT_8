const express = require("express");
const router = express.Router();
const controller = require('../../controller/User/auths')
router.post('/register', controller.register);
router.post('/verify-email', controller.vertifyAccount);
router.post('/forgot-password', controller.forgot);
router.post('/otp-forgot', controller.otp);
router.post('/reset-password', controller.reset);
router.post('/resend-otp', controller.resendOtp);

module.exports = router;