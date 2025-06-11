const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth")
const { upload } = require('../../middleware/upload.middleware');
const controller = require('../../controller/ProductManager/productController');

router.get('/getAllProducts', controller.getAllProducts);
router.get('/getProductById/:id', controller.getProductById);
router.get('/getProductBySlug/:slug', controller.getProductBySlug);
router.post('/createProduct', Authozation.authenticateToken, Authozation.authorizeRoles(3), upload.fields([{ name: 'image', maxCount: 3 }]), controller.createProduct);
router.put('/updateProduct/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), upload.fields([{ name: 'image', maxCount: 3 }]), controller.updateProduct);
router.delete('/deleteProduct/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.deleteProduct);
router.put('/activeProduct/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.activeProduct);
router.put('/updateStock/:id', Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.updateStock);
router.get("/total-stock", controller.getTotalStock);
router.post("/consolidateProductVariants/:id", Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.consolidateProductVariants);
router.post("/update-all-slugs", Authozation.authenticateToken, Authozation.authorizeRoles(3), controller.updateAllProductSlugs);

module.exports = router;