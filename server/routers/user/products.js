const express = require('express');
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require('../../controller/User/products')

router.get('/', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.allProducts)
router.get('/:slug', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.detailProducts)

module.exports = router;