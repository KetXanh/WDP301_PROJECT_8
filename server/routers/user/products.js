const express = require('express');
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require('../../controller/User/products')

router.get('/', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.allProducts)

module.exports = router;