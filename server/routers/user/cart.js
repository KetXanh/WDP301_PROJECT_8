const express = require('express');
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require('../../controller/User/cart')

router.post('/', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.addItemToCart);
router.get('/user-cart', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.getCart);
router.put('/incre-item/:productId', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.increaseItemQuantity);
router.put('/decre-item/:productId', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.decreaseItemQuantity);
router.delete('/remove-item/:productId', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.removeItemFromCart);

module.exports = router;