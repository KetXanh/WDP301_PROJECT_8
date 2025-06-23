const express = require('express');
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require('../../controller/User/products')

router.get('/', controller.allProducts)
router.get('/categories', controller.allCategories)
router.get('/:slug', controller.detailProducts)
router.get('/sort/:sort', controller.sortProduct)
router.get('/search/:search', controller.searchProduct)
module.exports = router;