const express = require('express');
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require('../../controller/User/order')

router.get('/order-history', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.getOrderByUser);
router.get('/:id', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.getOrderById);
router.post('/', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.userOrder);

module.exports = router;