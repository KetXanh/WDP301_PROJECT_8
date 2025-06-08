const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth")
const { upload } = require('../../middleware/upload.middleware');
const controller = require('../../controller/ProductManager/productController');
const { authorizeRoles } = require('../../middleware/auth');

router.get('/getAllProducts', controller.getAllProducts);
router.get('/getProductById/:id', controller.getProductById);
router.post('/createProduct', Authozation.authenticateToken, authorizeRoles(3), upload.fields([{ name: 'image', maxCount: 3 }]), controller.createProduct);
router.put('/updateProduct/:id', Authozation.authenticateToken, authorizeRoles(3), upload.fields([{ name: 'image', maxCount: 3 }]), controller.updateProduct);
router.delete('/deleteProduct/:id', Authozation.authenticateToken, authorizeRoles(3), controller.deleteProduct);
router.put('/activeProduct/:id', Authozation.authenticateToken, authorizeRoles(3), controller.activeProduct);
router.put('/updateStock/:id', Authozation.authenticateToken, authorizeRoles(3), controller.updateStock);
router.get("/total-stock", controller.getTotalStock);
router.post("/consolidateProductVariants/:id", Authozation.authenticateToken, authorizeRoles(3), controller.consolidateProductVariants);

module.exports = router;