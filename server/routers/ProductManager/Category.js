const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth")
const { upload } = require('../../middleware/upload.middleware');
const controller = require('../../controller/ProductManager/category.controller');


router.get('/getAllCategories', controller.getAllCategories);
// router.get('/getCategoryById/:id', controller.getCategoryById);
router.post('/createCategory', Authozation.authenticateToken, controller.createCategory);
router.put('/updateCategory/:id', Authozation.authenticateToken, controller.updateCategory);
router.delete('/deleteCategory/:id', Authozation.authenticateToken, controller.deleteCategory);
router.put('/activeCategory/:id', Authozation.authenticateToken, controller.activeCategory);

router.get('/getAllSubCategories', controller.getAllSubCategories);
// router.get('/getSubCategoryById/:id', controller.getSubCategoryById);
router.post('/createSubCategory', Authozation.authenticateToken, controller.createSubCategory);
router.put('/updateSubCategory/:id', Authozation.authenticateToken, controller.updateSubCategory);
router.delete('/deleteSubCategory/:id', Authozation.authenticateToken, controller.deleteSubCategory);
router.put('/activeSubCategory/:id', Authozation.authenticateToken, controller.activeSubCategory);

module.exports = router;
