const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth")
const controller = require('../../controller/User/auths')
const { upload } = require('../../middleware/upload.middleware');

router.post('/register', controller.register);
router.post('/verify-email', controller.vertifyAccount);
router.post('/forgot-password', Authozation.authenticateToken, controller.forgot);
router.post('/otp-forgot', Authozation.authenticateToken, controller.otp);
router.post('/reset-password', Authozation.authenticateToken, controller.reset);
router.post('/resend-otp', controller.resendOtp);
router.get('/profile', Authozation.authenticateToken, controller.getProfile);
router.post('/profile', Authozation.authenticateToken, upload.fields([{ name: 'avatar', maxCount: 1 }]), controller.updateProfile);
router.post('/login-google', controller.loginGoogle);

module.exports = router;