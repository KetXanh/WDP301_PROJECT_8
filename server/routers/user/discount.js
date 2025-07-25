const express = require('express');
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require('../../controller/User/discount')

router.get('/get-discount', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.getUserDiscounts);
router.post('/apply-discount', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.applyDiscount);

module.exports = router;
