const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth")
const { upload } = require('../../middleware/upload.middleware');
const controller = require('../../controller/ProductManager/category.controller');
const discountController = require("../../controller/ProductManager/discountController");


router.get('/getAllCategories', controller.getAllCategories);
router.get('/getCategoryBySlug/:slug', controller.getCategoryBySlug);
// router.get('/getCategoryById/:id', controller.getCategoryById);
router.post('/createCategory', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.createCategory);
router.put('/updateCategory/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.updateCategory);
router.delete('/deleteCategory/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.deleteCategory);
router.put('/activeCategory/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.activeCategory);
router.get("/category-stats", controller.getCategoryAndSubCategoryStats);
router.get('/getAllSubCategories', controller.getAllSubCategories);
router.get("/product-by-category", controller.getProductCountByCategory);
// router.get('/getSubCategoryById/:id', controller.getSubCategoryById);
router.get('/getSubCategoryBySlug/:slug', controller.getSubCategoryBySlug);
router.post('/createSubCategory', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.createSubCategory);
router.put('/updateSubCategory/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.updateSubCategory);
router.delete('/deleteSubCategory/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.deleteSubCategory);
router.put('/activeSubCategory/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.activeSubCategory);

router.post("/discount", discountController.createDiscount);
router.get("/discount", discountController.getAllDiscounts);
router.get("/discount/:id", discountController.getDiscountById);
router.put("/discount/:id", discountController.updateDiscount);
router.delete("/discount/:id", discountController.deleteDiscount);

module.exports = router;
