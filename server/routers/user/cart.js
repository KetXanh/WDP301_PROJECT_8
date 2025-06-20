const express = require('express');
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require('../../controller/User/cart')

router.post('/', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.addItemToCart);
router.get('/user-cart', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.getCart);

module.exports = router;