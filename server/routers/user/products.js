const express = require('express');
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require('../../controller/User/products')

router.get('/', controller.allProducts)
router.get('/categories', Authozation.authenticateToken, Authozation.authorizeRoles(0, 3), controller.allCategories)
router.get('/:slug', controller.detailProducts)
module.exports = router;