const express = require('express');
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require('../../controller/User/vnpay')

router.post('/create_payment_url', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.createPayment)
router.get('/vnpay_return', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.returnVnpay)
router.get('/vnpay_ipn', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.vnpayIpn)

module.exports = router;