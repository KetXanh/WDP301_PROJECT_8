const express = require('express');
const router = express.Router();
const userDiscountController = require('../../controller/User/userDiscountController');
const Authozation = require("../../middleware/auth")


router.get('/discounts', Authozation.authenticateToken, userDiscountController.listUserDiscounts);
router.post('/assign', Authozation.authenticateToken, userDiscountController.assignDiscountToUser);
router.delete('/remove/:discountId', Authozation.authenticateToken, userDiscountController.removeDiscountFromUser);
router.post('/use', Authozation.authenticateToken, userDiscountController.useDiscount);
router.post('/receivable', Authozation.authenticateToken, userDiscountController.addReceivableDiscount);
router.post('/update-expiring', Authozation.authenticateToken, userDiscountController.updateExpiringDiscounts);
router.get('/notify-expiring', Authozation.authenticateToken, userDiscountController.notifyExpiringDiscounts);

module.exports = router;