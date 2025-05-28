const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth")
const { upload } = require('../../middleware/upload.middleware');
const controller = require('../../controller/ProductManager/productController');

router.get('/getAllProducts', controller.getAllProducts);
router.get('/getProductById/:id', controller.getProductById);
router.post('/createProduct', Authozation.authenticateToken, upload.fields([{ name: 'image', maxCount: 3 }]), controller.createProduct);
router.put('/updateProduct/:id', Authozation.authenticateToken, upload.fields([{ name: 'image', maxCount: 3 }]), controller.updateProduct);
router.delete('/deleteProduct/:id', Authozation.authenticateToken, controller.deleteProduct);
router.put('/activeProduct/:id', Authozation.authenticateToken, controller.activeProduct);
router.put('/updateStock/:id', Authozation.authenticateToken, controller.updateStock);
router.get("/total-stock", controller.getTotalStock);

module.exports = router;