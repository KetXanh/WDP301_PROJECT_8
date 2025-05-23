const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth")
const controller = require('../../controller/User/auths')
router.post('/register', controller.register);
router.post('/verify-email', controller.vertifyAccount);
router.post('/forgot-password', Authozation.authenticateToken, controller.forgot);
router.post('/otp-forgot', Authozation.authenticateToken, controller.otp);
router.post('/reset-password', Authozation.authenticateToken, controller.reset);
router.post('/resend-otp', controller.resendOtp);

module.exports = router;